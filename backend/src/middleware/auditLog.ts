import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { getParam } from '../utils/jwt';

export const auditLog = (action: string, entity: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json.bind(res);
    res.json = function (body: unknown) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        prisma.auditLog
          .create({
            data: {
              userId: req.user?.id,
              action,
              entity,
              entityId: getParam(req.params.id) || undefined,
              details: body as object,
              ipAddress: req.ip,
              userAgent: req.headers['user-agent'],
            },
          })
          .catch(() => {});
      }
      return originalJson(body);
    };
    next();
  };
};

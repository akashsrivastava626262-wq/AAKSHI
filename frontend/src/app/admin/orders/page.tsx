'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { ArrowLeft } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { formatPrice, ORDER_STATUS_LABELS } from '@/lib/utils';
import type { RootState } from '@/store';

export default function AdminOrdersPage() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [orders, setOrders] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN')) { router.push('/'); return; }
    adminApi.getOrders()
      .then(({ data }) => setOrders(data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated, user, router]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await adminApi.updateOrderStatus(id, { status });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    } catch {}
  };

  return (
    <div className="min-h-screen bg-premium-light p-6 md:p-8">
      <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-premium-gray hover:text-rose-gold mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>
      <h1 className="font-serif text-2xl mb-8">Order Management</h1>

      {loading ? (
        <div className="h-64 shimmer" />
      ) : (
        <div className="bg-white border border-beige overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-beige/50">
              <tr>
                <th className="text-left p-4 font-medium">Order</th>
                <th className="text-left p-4 font-medium">Customer</th>
                <th className="text-left p-4 font-medium">Total</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Payment</th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige">
              {orders.map((order) => {
                const o = order as { id: string; orderNumber: string; total: number; status: string; paymentStatus: string; user: { name: string; email: string }; createdAt: string };
                return (
                  <tr key={o.id}>
                    <td className="p-4">
                      <p className="font-medium">{o.orderNumber}</p>
                      <p className="text-xs text-premium-gray">{new Date(o.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="p-4">
                      <p>{o.user.name}</p>
                      <p className="text-xs text-premium-gray">{o.user.email}</p>
                    </td>
                    <td className="p-4 font-medium">{formatPrice(o.total)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${ORDER_STATUS_LABELS[o.status]?.color || 'bg-gray-100'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs">{o.paymentStatus}</td>
                    <td className="p-4">
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                        className="text-xs border border-beige px-2 py-1"
                      >
                        {Object.keys(ORDER_STATUS_LABELS).map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

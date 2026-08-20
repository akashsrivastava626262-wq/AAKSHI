'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { Package, ChevronRight } from 'lucide-react';
import { orderApi } from '@/lib/api';
import { formatPrice, ORDER_STATUS_LABELS } from '@/lib/utils';
import type { RootState } from '@/store';
import type { Order } from '@/types';

export default function OrdersPage() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    orderApi.getAll()
      .then(({ data }) => setOrders(data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated, router]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20"><div className="h-64 shimmer" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <h1 className="font-serif text-3xl mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <Package className="w-16 h-16 mx-auto text-beige-dark" />
          <p className="text-premium-gray">No orders yet</p>
          <Link href="/shop" className="text-rose-gold hover:underline text-sm">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const status = ORDER_STATUS_LABELS[order.status] || { label: order.status, color: 'bg-gray-100' };
            return (
              <Link key={order.id} href={`/orders/${order.id}`} className="block border border-beige p-4 md:p-6 hover:border-rose-gold/30 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="text-xs text-premium-gray">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${status.color}`}>{status.label}</span>
                    <ChevronRight className="w-4 h-4 text-premium-gray" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {order.items.slice(0, 3).map(item => (
                    <div key={item.id} className="relative w-12 h-12 overflow-hidden bg-beige/30">
                      <Image src={item.product.images[0]} alt="" fill className="object-cover" sizes="48px" />
                    </div>
                  ))}
                  {order.items.length > 3 && <span className="text-xs text-premium-gray">+{order.items.length - 3} more</span>}
                  <span className="ml-auto font-semibold">{formatPrice(order.total)}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

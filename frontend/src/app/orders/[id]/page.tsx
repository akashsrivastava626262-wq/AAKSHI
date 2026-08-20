'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { ArrowLeft, Package, MapPin, CreditCard } from 'lucide-react';
import { orderApi } from '@/lib/api';
import { formatPrice, ORDER_STATUS_LABELS } from '@/lib/utils';
import type { RootState } from '@/store';
import type { Order } from '@/types';

export default function OrderDetailPage() {
  const { id } = useParams();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    orderApi.getById(id as string)
      .then(({ data }) => setOrder(data.data))
      .catch(() => router.push('/orders'))
      .finally(() => setLoading(false));
  }, [id, isAuthenticated, router]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20"><div className="h-64 shimmer" /></div>;
  if (!order) return null;

  const status = ORDER_STATUS_LABELS[order.status] || { label: order.status, color: 'bg-gray-100' };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <Link href="/orders" className="inline-flex items-center gap-2 text-sm text-premium-gray hover:text-rose-gold mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </Link>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl">{order.orderNumber}</h1>
            <p className="text-sm text-premium-gray">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${status.color}`}>{status.label}</span>
        </div>

        {order.trackingNumber && (
          <div className="bg-beige/30 p-4 flex items-center gap-3">
            <Package className="w-5 h-5 text-rose-gold" />
            <div>
              <p className="text-sm font-medium">Tracking Number</p>
              <p className="text-sm text-premium-gray">{order.trackingNumber}</p>
            </div>
          </div>
        )}

        <div className="border border-beige divide-y divide-beige">
          {order.items.map(item => (
            <div key={item.id} className="flex gap-4 p-4">
              <Link href={`/products/${item.product.slug}`} className="relative w-16 h-16 overflow-hidden bg-beige/30 flex-shrink-0">
                <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="64px" />
              </Link>
              <div className="flex-1">
                <Link href={`/products/${item.product.slug}`} className="text-sm font-medium hover:text-rose-gold">{item.product.name}</Link>
                <p className="text-xs text-premium-gray">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>

        {order.address && (
          <div className="border border-beige p-4">
            <div className="flex items-center gap-2 mb-2"><MapPin className="w-4 h-4 text-rose-gold" /><h3 className="text-sm font-medium">Delivery Address</h3></div>
            <p className="text-sm text-premium-gray">{order.address.fullName}</p>
            <p className="text-sm text-premium-gray">{order.address.addressLine}, {order.address.city}, {order.address.state} - {order.address.pincode}</p>
          </div>
        )}

        <div className="border border-beige p-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-premium-gray">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
          {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(order.discount)}</span></div>}
          <div className="flex justify-between"><span className="text-premium-gray">Shipping</span><span>{order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}</span></div>
          <div className="border-t border-beige pt-2 flex justify-between font-semibold text-base">
            <span>Total</span><span>{formatPrice(order.total)}</span>
          </div>
          <div className="flex items-center gap-2 pt-2 text-xs text-premium-gray">
            <CreditCard className="w-3 h-3" />
            Payment: {order.paymentStatus} {order.paymentMethod && `via ${order.paymentMethod}`}
          </div>
        </div>
      </div>
    </div>
  );
}

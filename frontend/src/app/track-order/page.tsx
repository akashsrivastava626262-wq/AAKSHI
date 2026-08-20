'use client';

import { useState } from 'react';
import { Search, Package } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { orderApi } from '@/lib/api';
import { ORDER_STATUS_LABELS } from '@/lib/utils';
import type { Order } from '@/types';

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState<Partial<Order> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await orderApi.track(orderNumber);
      setOrder(data.data);
    } catch {
      setError('Order not found. Please check your order number.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const status = order?.status ? ORDER_STATUS_LABELS[order.status] : null;

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-8">
      <Package className="w-12 h-12 mx-auto text-rose-gold" />
      <h1 className="font-serif text-3xl">Track Your Order</h1>
      <p className="text-sm text-premium-gray">Enter your order number to track delivery status</p>

      <form onSubmit={handleTrack} className="flex gap-3">
        <Input value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder="e.g. AAK1234ABCD" className="flex-1" />
        <Button type="submit" variant="primary" isLoading={loading}><Search className="w-4 h-4" /></Button>
      </form>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {order && status && (
        <div className="border border-beige p-6 text-left space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-medium">{order.orderNumber}</p>
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${status.color}`}>{status.label}</span>
          </div>
          {order.trackingNumber && (
            <p className="text-sm text-premium-gray">Tracking: {order.trackingNumber}</p>
          )}
          <p className="text-sm text-premium-gray">Payment: {order.paymentStatus}</p>
        </div>
      )}
    </div>
  );
}

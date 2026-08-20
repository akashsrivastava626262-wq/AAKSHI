'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import { cartApi } from '@/lib/api';
import { setCart } from '@/store/cartSlice';
import { formatPrice } from '@/lib/utils';
import type { RootState } from '@/store';
import type { CartItem } from '@/types';

export default function CartPage() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { items, subtotal, itemCount } = useSelector((state: RootState) => state.cart);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    cartApi.get()
      .then(({ data }) => dispatch(setCart(data.data)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated, dispatch, router]);

  const updateQuantity = async (item: CartItem, quantity: number) => {
    if (quantity < 1) return;
    try {
      await cartApi.update(item.id, { quantity });
      const { data } = await cartApi.get();
      dispatch(setCart(data.data));
    } catch { toast.error('Failed to update quantity'); }
  };

  const removeItem = async (id: string) => {
    try {
      await cartApi.remove(id);
      const { data } = await cartApi.get();
      dispatch(setCart(data.data));
      toast.success('Item removed');
    } catch { toast.error('Failed to remove item'); }
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20"><div className="h-64 shimmer" /></div>;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6">
        <ShoppingBag className="w-16 h-16 mx-auto text-beige-dark" />
        <h1 className="font-serif text-2xl">Your cart is empty</h1>
        <p className="text-premium-gray">Discover our beautiful collection and find something you love.</p>
        <Link href="/shop"><Button variant="luxury" size="lg">Continue Shopping</Button></Link>
      </div>
    );
  }

  const shipping = subtotal >= 999 ? 0 : 99;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <h1 className="font-serif text-3xl mb-8">Shopping Cart ({itemCount})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 border border-beige">
              <Link href={`/products/${item.product.slug}`} className="relative w-24 h-24 flex-shrink-0 overflow-hidden bg-beige/30">
                <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="96px" />
              </Link>
              <div className="flex-1 space-y-2">
                <Link href={`/products/${item.product.slug}`} className="font-serif text-lg hover:text-rose-gold">{item.product.name}</Link>
                <p className="text-sm font-semibold">{formatPrice(item.product.discountedPrice || item.product.price)}</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-beige-dark">
                    <button onClick={() => updateQuantity(item, item.quantity - 1)} className="px-2 py-1"><Minus className="w-3 h-3" /></button>
                    <span className="px-3 text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item, item.quantity + 1)} className="px-2 py-1"><Plus className="w-3 h-3" /></button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <p className="font-semibold">{formatPrice((item.product.discountedPrice || item.product.price) * item.quantity)}</p>
            </div>
          ))}
        </div>

        <div className="bg-beige/30 p-6 h-fit space-y-4 sticky top-24">
          <h2 className="font-serif text-xl">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-premium-gray">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-premium-gray">Shipping</span><span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
            {subtotal < 999 && <p className="text-xs text-rose-gold">Add {formatPrice(999 - subtotal)} more for free shipping</p>}
          </div>
          <div className="border-t border-beige pt-4 flex justify-between font-semibold text-lg">
            <span>Total</span><span>{formatPrice(subtotal + shipping)}</span>
          </div>
          <Button variant="luxury" size="lg" className="w-full" onClick={() => router.push('/checkout')}>
            Proceed to Checkout <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { cartApi, orderApi } from '@/lib/api';
import { clearCart } from '@/store/cartSlice';
import { formatPrice } from '@/lib/utils';
import type { RootState } from '@/store';
import type { Address } from '@/types';

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function CheckoutPage() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { items, subtotal } = useSelector((state: RootState) => state.cart);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY');
  const [giftWrap, setGiftWrap] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ fullName: '', phone: '', addressLine: '', city: '', state: '', pincode: '' });
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    if (items.length === 0) { router.push('/cart'); return; }
    authApi_getProfile();
  }, [isAuthenticated, items, router]);

  const authApi_getProfile = async () => {
    try {
      const { authApi } = await import('@/lib/api');
      const { data } = await authApi.getProfile();
      setAddresses(data.data.addresses || []);
      const defaultAddr = data.data.addresses?.find((a: Address) => a.isDefault);
      if (defaultAddr) setSelectedAddress(defaultAddr.id);
    } catch {}
  };

  const applyCoupon = async () => {
    if (!couponCode) return;
    try {
      const { data } = await orderApi.validateCoupon(couponCode, subtotal);
      setDiscount(data.data.discount);
      toast.success(`Coupon applied! You save ${formatPrice(data.data.discount)}`);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Invalid coupon');
    }
  };

  const addAddress = async () => {
    try {
      const { data } = await orderApi.addAddress({ ...newAddress, label: 'Home', country: 'India', isDefault: addresses.length === 0 });
      setAddresses(prev => [...prev, data.data]);
      setSelectedAddress(data.data.id);
      setShowAddressForm(false);
      toast.success('Address added');
    } catch { toast.error('Failed to add address'); }
  };

  const handleCheckout = async () => {
    if (!selectedAddress) { toast.error('Please select a delivery address'); return; }
    setLoading(true);
    try {
      const { data } = await orderApi.create({
        addressId: selectedAddress,
        couponCode: discount > 0 ? couponCode : undefined,
        paymentMethod,
        giftWrap,
      });

      if (paymentMethod === 'RAZORPAY' && data.data.payment?.razorpayOrderId) {
        const options = {
          key: data.data.payment.key,
          amount: data.data.payment.amount * 100,
          currency: 'INR',
          name: 'AAKSHI',
          description: `Order ${data.data.order.orderNumber}`,
          order_id: data.data.payment.razorpayOrderId,
          handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
            await orderApi.verifyPayment({
              orderId: data.data.order.id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            });
            dispatch(clearCart());
            toast.success('Payment successful!');
            router.push(`/orders/${data.data.order.id}`);
          },
          prefill: { name: user?.name, email: user?.email },
          theme: { color: '#B76E79' },
        };

        if (typeof window !== 'undefined' && window.Razorpay) {
          new window.Razorpay(options).open();
        } else {
          toast.success('Order placed! (Demo mode - Razorpay not configured)');
          dispatch(clearCart());
          router.push(`/orders/${data.data.order.id}`);
        }
      } else {
        toast.success('Order placed successfully!');
        dispatch(clearCart());
        router.push(`/orders/${data.data.order.id}`);
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  const shipping = subtotal >= 999 ? 0 : 99;
  const giftWrapFee = giftWrap ? 49 : 0;
  const total = subtotal - discount + shipping + giftWrapFee;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <h1 className="font-serif text-3xl mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Address */}
          <section className="space-y-4">
            <h2 className="font-serif text-xl">Delivery Address</h2>
            {addresses.map(addr => (
              <label key={addr.id} className={`flex items-start gap-3 p-4 border cursor-pointer ${selectedAddress === addr.id ? 'border-rose-gold bg-rose-gold/5' : 'border-beige'}`}>
                <input type="radio" name="address" checked={selectedAddress === addr.id} onChange={() => setSelectedAddress(addr.id)} className="mt-1 accent-rose-gold" />
                <div>
                  <p className="font-medium">{addr.fullName}</p>
                  <p className="text-sm text-premium-gray">{addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}</p>
                  <p className="text-sm text-premium-gray">{addr.phone}</p>
                </div>
              </label>
            ))}
            {!showAddressForm ? (
              <button onClick={() => setShowAddressForm(true)} className="text-sm text-rose-gold hover:underline">+ Add new address</button>
            ) : (
              <div className="space-y-3 p-4 border border-beige">
                <Input label="Full Name" value={newAddress.fullName} onChange={(e) => setNewAddress(a => ({ ...a, fullName: e.target.value }))} />
                <Input label="Phone" value={newAddress.phone} onChange={(e) => setNewAddress(a => ({ ...a, phone: e.target.value }))} />
                <Input label="Address" value={newAddress.addressLine} onChange={(e) => setNewAddress(a => ({ ...a, addressLine: e.target.value }))} />
                <div className="grid grid-cols-3 gap-3">
                  <Input label="City" value={newAddress.city} onChange={(e) => setNewAddress(a => ({ ...a, city: e.target.value }))} />
                  <Input label="State" value={newAddress.state} onChange={(e) => setNewAddress(a => ({ ...a, state: e.target.value }))} />
                  <Input label="Pincode" value={newAddress.pincode} onChange={(e) => setNewAddress(a => ({ ...a, pincode: e.target.value }))} />
                </div>
                <Button variant="primary" onClick={addAddress}>Save Address</Button>
              </div>
            )}
          </section>

          {/* Payment */}
          <section className="space-y-4">
            <h2 className="font-serif text-xl">Payment Method</h2>
            {['RAZORPAY', 'STRIPE', 'UPI', 'COD'].map(method => (
              <label key={method} className={`flex items-center gap-3 p-4 border cursor-pointer ${paymentMethod === method ? 'border-rose-gold bg-rose-gold/5' : 'border-beige'}`}>
                <input type="radio" name="payment" checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} className="accent-rose-gold" />
                <span className="text-sm font-medium">{method === 'RAZORPAY' ? 'Razorpay (UPI/Card/Net Banking)' : method === 'STRIPE' ? 'Stripe (International Cards)' : method === 'UPI' ? 'UPI Payment' : 'Cash on Delivery'}</span>
              </label>
            ))}
          </section>

          {/* Coupon */}
          <section className="space-y-4">
            <h2 className="font-serif text-xl">Coupon Code</h2>
            <div className="flex gap-3">
              <Input value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="Enter coupon code" className="flex-1" />
              <Button variant="outline" onClick={applyCoupon}>Apply</Button>
            </div>
          </section>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={giftWrap} onChange={(e) => setGiftWrap(e.target.checked)} className="accent-rose-gold" />
            Add premium gift packaging (+₹49)
          </label>
        </div>

        {/* Summary */}
        <div className="bg-beige/30 p-6 h-fit space-y-4 sticky top-24">
          <h2 className="font-serif text-xl">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal ({items.length} items)</span><span>{formatPrice(subtotal)}</span></div>
            {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(discount)}</span></div>}
            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
            {giftWrapFee > 0 && <div className="flex justify-between"><span>Gift Wrap</span><span>{formatPrice(giftWrapFee)}</span></div>}
          </div>
          <div className="border-t border-beige pt-4 flex justify-between font-semibold text-lg">
            <span>Total</span><span>{formatPrice(total)}</span>
          </div>
          <Button variant="luxury" size="lg" className="w-full" isLoading={loading} onClick={handleCheckout}>
            Place Order — {formatPrice(total)}
          </Button>
        </div>
      </div>
    </div>
  );
}

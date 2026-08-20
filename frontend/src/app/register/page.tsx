'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { authApi } from '@/lib/api';
import { setCredentials } from '@/store/authSlice';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const { data } = await authApi.register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      dispatch(setCredentials(data.data));
      toast.success('Account created successfully!');
      router.push('/');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="font-serif text-3xl tracking-[0.2em] mb-2">AAKSHI</h1>
          <p className="text-sm text-premium-gray">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="Your name" />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} required placeholder="you@example.com" />
          <Input label="Phone" type="tel" value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 98765 43210" />
          <Input label="Password" type="password" value={form.password} onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))} required placeholder="Min 8 characters" />
          <Input label="Confirm Password" type="password" value={form.confirmPassword} onChange={(e) => setForm(f => ({ ...f, confirmPassword: e.target.value }))} required placeholder="••••••••" />
          <Button type="submit" variant="luxury" size="lg" isLoading={loading} className="w-full">Create Account</Button>
        </form>

        <p className="text-center text-sm text-premium-gray">
          Already have an account? <Link href="/login" className="text-rose-gold font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { authApi } from '@/lib/api';
import { updateUser, logout } from '@/store/authSlice';
import type { RootState } from '@/store';

export default function AccountPage() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    if (user) setForm({ name: user.name, phone: user.phone || '' });
  }, [isAuthenticated, user, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authApi.updateProfile(form);
      dispatch(updateUser(data.data));
      toast.success('Profile updated');
    } catch { toast.error('Failed to update profile'); }
    finally { setLoading(false); }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await authApi.changePassword({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword });
      toast.success('Password changed');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to change password');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <h1 className="font-serif text-3xl mb-8">My Account</h1>

      <div className="space-y-8">
        <div className="bg-beige/30 p-6 space-y-2">
          <p className="text-sm text-premium-gray">Email</p>
          <p className="font-medium">{user?.email}</p>
          <p className="text-sm text-premium-gray mt-4">Loyalty Points</p>
          <p className="font-serif text-2xl text-rose-gold">{user?.loyaltyPoints || 0} pts</p>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <h2 className="font-serif text-xl">Profile Information</h2>
          <Input label="Full Name" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} />
          <Button type="submit" variant="primary" isLoading={loading}>Save Changes</Button>
        </form>

        <form onSubmit={handleChangePassword} className="space-y-4 pt-8 border-t border-beige">
          <h2 className="font-serif text-xl">Change Password</h2>
          <Input label="Current Password" type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm(f => ({ ...f, currentPassword: e.target.value }))} />
          <Input label="New Password" type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm(f => ({ ...f, newPassword: e.target.value }))} />
          <Input label="Confirm New Password" type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm(f => ({ ...f, confirmPassword: e.target.value }))} />
          <Button type="submit" variant="outline">Change Password</Button>
        </form>

        <div className="pt-8 border-t border-beige">
          <Button variant="ghost" onClick={() => { dispatch(logout()); router.push('/'); }} className="text-red-500">
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}

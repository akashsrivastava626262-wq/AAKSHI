'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import {
  LayoutDashboard, Package, Users, ShoppingBag, Tag, Image as ImageIcon,
  MessageSquare, BarChart3, Settings, Star, TrendingUp, DollarSign
} from 'lucide-react';
import { adminApi } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import type { RootState } from '@/store';

const SIDEBAR_LINKS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Orders', href: '/admin/orders', icon: Package },
  { label: 'Products', href: '/admin/products', icon: ShoppingBag },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Coupons', href: '/admin/coupons', icon: Tag },
  { label: 'Banners', href: '/admin/banners', icon: ImageIcon },
  { label: 'Reviews', href: '/admin/reviews', icon: MessageSquare },
  { label: 'Sales Report', href: '/admin/sales', icon: BarChart3 },
];

interface DashboardData {
  stats: { totalOrders: number; totalRevenue: number; totalCustomers: number; totalProducts: number };
  recentOrders: Array<{ id: string; orderNumber: string; total: number; status: string; user: { name: string }; createdAt: string }>;
  topProducts: Array<{ name: string; totalSold: number; price: number }>;
}

export default function AdminDashboard() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    if (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN') { router.push('/'); return; }
    adminApi.getDashboard()
      .then(({ data }) => setData(data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated, user, router]);

  if (loading) return <div className="min-h-screen flex"><div className="w-64 bg-premium-black" /><div className="flex-1 p-8"><div className="h-96 shimmer" /></div></div>;

  const stats = [
    { label: 'Total Revenue', value: formatPrice(data?.stats.totalRevenue || 0), icon: DollarSign, color: 'text-green-600' },
    { label: 'Total Orders', value: data?.stats.totalOrders || 0, icon: Package, color: 'text-blue-600' },
    { label: 'Customers', value: data?.stats.totalCustomers || 0, icon: Users, color: 'text-purple-600' },
    { label: 'Products', value: data?.stats.totalProducts || 0, icon: ShoppingBag, color: 'text-rose-gold' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-premium-black text-white flex-shrink-0 hidden md:block">
        <div className="p-6">
          <h1 className="font-serif text-xl tracking-[0.2em]">AAKSHI</h1>
          <p className="text-xs text-white/40 mt-1">Admin Panel</p>
        </div>
        <nav className="px-3 space-y-1">
          {SIDEBAR_LINKS.map(link => (
            <Link key={link.href} href={link.href} className="flex items-center gap-3 px-3 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded transition-colors">
              <link.icon className="w-4 h-4" /> {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-premium-light p-6 md:p-8 overflow-auto">
        <h2 className="font-serif text-2xl mb-8">Dashboard</h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(stat => (
            <div key={stat.label} className="bg-white p-6 border border-beige">
              <div className="flex items-center justify-between mb-3">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-2xl font-semibold">{stat.value}</p>
              <p className="text-xs text-premium-gray mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white border border-beige">
            <div className="p-4 border-b border-beige flex items-center justify-between">
              <h3 className="font-medium">Recent Orders</h3>
              <Link href="/admin/orders" className="text-xs text-rose-gold hover:underline">View All</Link>
            </div>
            <div className="divide-y divide-beige">
              {(data?.recentOrders || []).slice(0, 5).map(order => (
                <div key={order.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{order.orderNumber}</p>
                    <p className="text-xs text-premium-gray">{order.user.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatPrice(order.total)}</p>
                    <p className="text-xs text-premium-gray">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white border border-beige">
            <div className="p-4 border-b border-beige">
              <h3 className="font-medium">Top Selling Products</h3>
            </div>
            <div className="divide-y divide-beige">
              {(data?.topProducts || []).map((product, i) => (
                <div key={i} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-beige flex items-center justify-center text-xs font-medium">{i + 1}</span>
                    <p className="text-sm font-medium">{product.name}</p>
                  </div>
                  <p className="text-sm text-premium-gray">{product.totalSold} sold</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

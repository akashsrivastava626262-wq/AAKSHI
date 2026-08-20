'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { ArrowLeft } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import type { RootState } from '@/store';
import type { Product } from '@/types';

export default function AdminProductsPage() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN')) { router.push('/'); return; }
    adminApi.getProducts()
      .then(({ data }) => setProducts(data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen bg-premium-light p-6 md:p-8">
      <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-premium-gray hover:text-rose-gold mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-2xl">Product Management</h1>
        <span className="text-sm text-premium-gray">{products.length} products</span>
      </div>

      {loading ? (
        <div className="h-64 shimmer" />
      ) : (
        <div className="bg-white border border-beige overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-beige/50">
              <tr>
                <th className="text-left p-4 font-medium">Product</th>
                <th className="text-left p-4 font-medium">SKU</th>
                <th className="text-left p-4 font-medium">Price</th>
                <th className="text-left p-4 font-medium">Stock</th>
                <th className="text-left p-4 font-medium">Rating</th>
                <th className="text-left p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige">
              {products.map(product => (
                <tr key={product.id}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={product.images[0]} alt="" className="w-10 h-10 object-cover" />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-premium-gray">{product.category?.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-xs">{product.sku}</td>
                  <td className="p-4">
                    <p className="font-medium">{formatPrice(product.discountedPrice || product.price)}</p>
                    {product.discountedPrice && <p className="text-xs text-premium-gray line-through">{formatPrice(product.price)}</p>}
                  </td>
                  <td className="p-4">
                    <span className={product.stock <= 5 ? 'text-red-500 font-medium' : ''}>{product.stock}</span>
                  </td>
                  <td className="p-4">{product.rating} ({product.reviewCount})</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${product.isActive !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {product.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

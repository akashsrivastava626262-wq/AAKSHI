'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { Heart, ShoppingBag } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { cartApi } from '@/lib/api';
import type { RootState } from '@/store';
import type { Product } from '@/types';

export default function WishlistPage() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [items, setItems] = useState<{ id: string; product: Product }[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    cartApi.getWishlist()
      .then(({ data }) => setItems(data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated, router]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20"><div className="h-64 shimmer" /></div>;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6">
        <Heart className="w-16 h-16 mx-auto text-beige-dark" />
        <h1 className="font-serif text-2xl">Your wishlist is empty</h1>
        <Link href="/shop" className="inline-block px-8 py-3 bg-rose-gold text-white text-sm uppercase tracking-widest">Browse Collection</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <h1 className="font-serif text-3xl mb-8">My Wishlist ({items.length})</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {items.map(({ product }, index) => <ProductCard key={product.id} product={product} index={index} />)}
      </div>
    </div>
  );
}

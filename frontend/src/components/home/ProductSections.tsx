'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { productApi } from '@/lib/api';
import { getSampleProducts } from '@/lib/sampleData';
import type { Product } from '@/types';

interface ProductSectionProps {
  title: string;
  subtitle: string;
  fetchFn: () => Promise<{ data: { data: Product[] } }>;
  viewAllHref: string;
  bgClass?: string;
}

function ProductSection({ title, subtitle, fetchFn, viewAllHref, bgClass = 'bg-premium-light' }: ProductSectionProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFn()
      .then(({ data }) => setProducts(data.data))
      .catch(() => {
        const filterMap: Record<string, { featured?: boolean; bestSeller?: boolean; newArrival?: boolean; trending?: boolean; category?: string }> = {
          'best-sellers': { bestSeller: true },
          'new-arrivals': { newArrival: true },
          'trending-earrings': { trending: true, category: 'earrings' },
          'trending-necklaces': { trending: true, category: 'necklaces' },
        };
        const key = title.toLowerCase().replace(/\s/g, '-');
        setProducts(getSampleProducts(filterMap[key] || {}));
      })
      .finally(() => setLoading(false));
  }, [fetchFn, title]);

  return (
    <section className={`py-20 md:py-28 ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs uppercase tracking-[0.3em] text-rose-gold mb-3"
            >
              {subtitle}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-serif text-3xl md:text-4xl text-premium-black"
            >
              {title}
            </motion.h2>
          </div>
          <Link
            href={viewAllHref}
            className="hidden sm:inline-flex items-center gap-2 text-xs uppercase tracking-widest text-rose-gold hover:gap-3 transition-all"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] shimmer" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.slice(0, 4).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link href={viewAllHref} className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-rose-gold">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function BestSellers() {
  return (
    <ProductSection
      title="Best Sellers"
      subtitle="Most Loved"
      fetchFn={() => productApi.getBestSellers()}
      viewAllHref="/shop?bestSeller=true"
    />
  );
}

export function NewArrivals() {
  return (
    <ProductSection
      title="New Arrivals"
      subtitle="Just Landed"
      fetchFn={() => productApi.getNewArrivals()}
      viewAllHref="/shop?newArrival=true"
      bgClass="bg-white"
    />
  );
}

export function TrendingEarrings() {
  return (
    <ProductSection
      title="Trending Earrings"
      subtitle="Hot Right Now"
      fetchFn={() => productApi.getTrending('earrings')}
      viewAllHref="/collections/earrings"
    />
  );
}

export function TrendingNecklaces() {
  return (
    <ProductSection
      title="Trending Necklaces"
      subtitle="Must Have"
      fetchFn={() => productApi.getTrending('necklaces')}
      viewAllHref="/collections/necklaces"
      bgClass="bg-white"
    />
  );
}

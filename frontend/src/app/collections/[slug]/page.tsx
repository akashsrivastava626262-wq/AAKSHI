'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import ProductCard from '@/components/product/ProductCard';
import { productApi } from '@/lib/api';
import { getSampleProducts } from '@/lib/sampleData';
import type { Product } from '@/types';

function CollectionContent() {
  const { slug } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const titles: Record<string, { title: string; description: string }> = {
    earrings: { title: 'Earrings', description: 'From delicate studs to statement hoops — find your perfect pair' },
    necklaces: { title: 'Necklaces', description: 'Elegant chains, pendants, and layered necklaces for every style' },
    'korean-jewellery': { title: 'Korean Jewellery', description: 'Trendy Korean-inspired pieces for the fashion-forward woman' },
    'anti-tarnish': { title: 'Anti-Tarnish Collection', description: 'Long-lasting shine with our 2-year anti-tarnish guarantee' },
  };

  const collection = titles[slug as string] || { title: 'Collection', description: 'Browse our curated collection' };

  useEffect(() => {
    productApi.getAll({ category: slug as string, limit: 24 })
      .then(({ data }) => setProducts(data.data))
      .catch(() => setProducts(getSampleProducts({ category: slug as string })))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <div className="text-center mb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-rose-gold mb-3">Collection</p>
        <h1 className="font-serif text-3xl md:text-4xl text-premium-black mb-3">{collection.title}</h1>
        <p className="text-sm text-premium-gray max-w-md mx-auto">{collection.description}</p>
        <div className="section-divider mt-4" />
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(4)].map((_, i) => <div key={i} className="aspect-[3/4] shimmer" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}
        </div>
      )}
    </div>
  );
}

export default function CollectionPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-20"><div className="h-96 shimmer" /></div>}>
      <CollectionContent />
    </Suspense>
  );
}

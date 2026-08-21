'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { productApi } from '@/lib/api';
import { getSampleProducts } from '@/lib/sampleData';
import type { Product, Category } from '@/types';

function ShopContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    sort: searchParams.get('sort') || 'newest',
    search: searchParams.get('search') || '',
    minPrice: '',
    maxPrice: '',
    bestSeller: searchParams.get('bestSeller') === 'true',
    newArrival: searchParams.get('newArrival') === 'true',
  });

  useEffect(() => {
    productApi.getCategories().then(({ data }) => setCategories(data.data)).catch(() => {
      setCategories([
        { id: '1', name: 'Earrings', slug: 'earrings', _count: { products: 2 } },
        { id: '2', name: 'Necklaces', slug: 'necklaces', _count: { products: 3 } },
        { id: '3', name: 'Korean Jewellery', slug: 'korean-jewellery', _count: { products: 3 } },
        { id: '4', name: 'Anti-Tarnish', slug: 'anti-tarnish', _count: { products: 2 } },
      ]);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string | boolean> = { limit: '24' };
    if (filters.category) params.category = filters.category;
    if (filters.sort) params.sort = filters.sort;
    if (filters.search) params.search = filters.search;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.bestSeller) params.bestSeller = true;
    if (filters.newArrival) params.newArrival = true;

    productApi.getAll(params)
      .then(({ data }) => setProducts(data.data))
      .catch(() => {
        let products = getSampleProducts({
          bestSeller: filters.bestSeller || undefined,
          newArrival: filters.newArrival || undefined,
          category: filters.category || undefined,
        });
        if (filters.search) {
          const q = filters.search.toLowerCase();
          products = products.filter(p => p.name.toLowerCase().includes(q) || p.tags.some(t => t.includes(q)));
        }
        setProducts(products);
      })
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl text-premium-black mb-2">Shop All</h1>
        <p className="text-sm text-premium-gray">Discover our complete collection of premium fashion jewellery</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="space-y-6 sticky top-24">
            <div>
              <h3 className="text-xs uppercase tracking-widest text-premium-black mb-3">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setFilters(f => ({ ...f, category: '' }))}
                  className={`block w-full text-left text-sm py-1 ${!filters.category ? 'text-rose-gold font-medium' : 'text-premium-gray hover:text-rose-gold'}`}
                >
                  All Products
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setFilters(f => ({ ...f, category: cat.slug }))}
                    className={`block w-full text-left text-sm py-1 ${filters.category === cat.slug ? 'text-rose-gold font-medium' : 'text-premium-gray hover:text-rose-gold'}`}
                  >
                    {cat.name} {cat._count && `(${cat._count.products})`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-widest text-premium-black mb-3">Sort By</h3>
              <select
                value={filters.sort}
                onChange={(e) => setFilters(f => ({ ...f, sort: e.target.value }))}
                className="w-full px-3 py-2 border border-beige-dark text-sm bg-white focus:outline-none focus:border-rose-gold"
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-widest text-premium-black mb-3">Price Range</h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => setFilters(f => ({ ...f, minPrice: e.target.value }))}
                  className="w-full px-3 py-2 border border-beige-dark text-sm focus:outline-none focus:border-rose-gold"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
                  className="w-full px-3 py-2 border border-beige-dark text-sm focus:outline-none focus:border-rose-gold"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-premium-gray">{products.length} products</p>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 text-sm text-premium-gray"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {[...Array(6)].map((_, i) => <div key={i} className="aspect-[3/4] shimmer" />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-premium-gray">No products found. Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-20"><div className="h-96 shimmer" /></div>}>
      <ShopContent />
    </Suspense>
  );
}

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingBag, Truck, Shield, RefreshCw, Minus, Plus, ChevronRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import ProductCard from '@/components/product/ProductCard';
import { productApi, cartApi } from '@/lib/api';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { getSampleProductBySlug, getSampleProducts } from '@/lib/sampleData';
import type { Product } from '@/types';
import type { RootState } from '@/store';

function ProductDetailContent() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [giftWrap, setGiftWrap] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!slug) return;
    productApi.getBySlug(slug as string)
      .then(({ data }) => {
        setProduct(data.data);
        return productApi.getRecommendations(data.data.id);
      })
      .then(({ data }) => setRecommendations(data.data))
      .catch(() => {
        const sample = getSampleProductBySlug(slug as string);
        if (sample) {
          setProduct(sample);
          setRecommendations(getSampleProducts().filter(p => p.slug !== slug).slice(0, 4));
        } else {
          toast.error('Product not found');
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { toast.error('Please login first'); return; }
    if (!product) return;
    try {
      await cartApi.add({ productId: product.id, quantity, giftWrap });
      toast.success('Added to cart!');
    } catch { toast.error('Failed to add to cart'); }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    window.location.href = '/checkout';
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) { toast.error('Please login first'); return; }
    if (!product) return;
    try {
      await cartApi.addToWishlist(product.id);
      toast.success('Added to wishlist!');
    } catch { toast.error('Failed to add to wishlist'); }
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20"><div className="h-96 shimmer" /></div>;
  if (!product) return <div className="max-w-7xl mx-auto px-4 py-20 text-center"><p>Product not found</p></div>;

  const discount = calculateDiscount(product.price, product.discountedPrice);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-premium-gray mb-8">
        <Link href="/" className="hover:text-rose-gold">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/shop" className="hover:text-rose-gold">Shop</Link>
        {product.category && (
          <>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/collections/${product.category.slug}`} className="hover:text-rose-gold">{product.category.name}</Link>
          </>
        )}
        <ChevronRight className="w-3 h-3" />
        <span className="text-premium-black">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden bg-beige/30">
            <Image src={product.images[selectedImage]} alt={product.name} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)} className={`relative w-20 h-20 overflow-hidden border-2 ${selectedImage === i ? 'border-rose-gold' : 'border-transparent'}`}>
                  <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          {product.category && <p className="text-xs uppercase tracking-widest text-rose-gold">{product.category.name}</p>}
          <h1 className="font-serif text-3xl md:text-4xl text-premium-black">{product.name}</h1>

          <div className="flex items-center gap-3">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-champagne text-champagne' : 'text-beige-dark'}`} />
              ))}
            </div>
            <span className="text-sm text-premium-gray">{product.rating} ({product.reviewCount} reviews)</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-semibold">{formatPrice(product.discountedPrice || product.price)}</span>
            {product.discountedPrice && (
              <>
                <span className="text-lg text-premium-gray line-through">{formatPrice(product.price)}</span>
                <span className="text-sm font-semibold text-rose-gold">{discount}% OFF</span>
              </>
            )}
          </div>

          <p className="text-sm text-premium-gray leading-relaxed">{product.description}</p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-premium-gray">SKU:</span> <span className="font-medium">{product.sku}</span></div>
            <div><span className="text-premium-gray">Material:</span> <span className="font-medium">{product.material}</span></div>
            <div><span className="text-premium-gray">Weight:</span> <span className="font-medium">{product.weight}</span></div>
            <div>
              <span className="text-premium-gray">Stock:</span>{' '}
              <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
              </span>
            </div>
          </div>

          {/* Quantity & Actions */}
          <div className="space-y-4 pt-4 border-t border-beige">
            <div className="flex items-center gap-4">
              <span className="text-sm text-premium-gray">Quantity:</span>
              <div className="flex items-center border border-beige-dark">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 hover:bg-beige"><Minus className="w-4 h-4" /></button>
                <span className="px-4 py-2 text-sm font-medium">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="px-3 py-2 hover:bg-beige"><Plus className="w-4 h-4" /></button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={giftWrap} onChange={(e) => setGiftWrap(e.target.checked)} className="accent-rose-gold" />
              Add gift packaging (+₹49)
            </label>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="primary" size="lg" onClick={handleAddToCart} disabled={product.stock === 0} className="flex-1">
                <ShoppingBag className="w-4 h-4 mr-2" /> Add to Cart
              </Button>
              <Button variant="luxury" size="lg" onClick={handleBuyNow} disabled={product.stock === 0} className="flex-1">
                Buy Now
              </Button>
              <button onClick={handleWishlist} className="p-4 border border-beige-dark hover:border-rose-gold hover:text-rose-gold transition-colors">
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-beige">
            <div className="text-center space-y-1">
              <Truck className="w-5 h-5 mx-auto text-rose-gold" />
              <p className="text-[10px] text-premium-gray">Free Shipping ₹999+</p>
            </div>
            <div className="text-center space-y-1">
              <Shield className="w-5 h-5 mx-auto text-rose-gold" />
              <p className="text-[10px] text-premium-gray">Secure Payment</p>
            </div>
            <div className="text-center space-y-1">
              <RefreshCw className="w-5 h-5 mx-auto text-rose-gold" />
              <p className="text-[10px] text-premium-gray">7-Day Returns</p>
            </div>
          </div>

          {/* Care Instructions */}
          <div className="pt-4 border-t border-beige">
            <h3 className="text-sm font-semibold mb-2">Care Instructions</h3>
            <p className="text-sm text-premium-gray">{product.careInstructions}</p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <section className="mt-20">
          <h2 className="font-serif text-2xl md:text-3xl text-center mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {recommendations.slice(0, 4).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-20"><div className="h-96 shimmer" /></div>}>
      <ProductDetailContent />
    </Suspense>
  );
}

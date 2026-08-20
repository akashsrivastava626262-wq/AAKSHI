'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import type { Product } from '@/types';
import type { RootState } from '@/store';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { cartApi } from '@/lib/api';
import Badge from '@/components/ui/Badge';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const discount = calculateDiscount(product.price, product.discountedPrice);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    try {
      await cartApi.add({ productId: product.id });
      toast.success('Added to cart!');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      return;
    }
    try {
      if (isWishlisted) {
        await cartApi.removeFromWishlist(product.id);
        setIsWishlisted(false);
        toast.success('Removed from wishlist');
      } else {
        await cartApi.addToWishlist(product.id);
        setIsWishlisted(true);
        toast.success('Added to wishlist!');
      }
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/products/${product.slug}`} className="group block">
        <div
          className="product-card relative overflow-hidden bg-beige/30"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="product-image object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            {product.images[1] && isHovered && (
              <Image
                src={product.images[1]}
                alt={product.name}
                fill
                className="product-image object-cover absolute inset-0"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            )}

            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {discount > 0 && <Badge variant="sale">{discount}% OFF</Badge>}
              {product.isNewArrival && <Badge variant="new">New</Badge>}
              {product.isBestSeller && <Badge variant="bestseller">Best Seller</Badge>}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              className="absolute top-3 right-3 flex flex-col gap-2"
            >
              <button
                onClick={handleWishlist}
                className="w-9 h-9 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-rose-gold hover:text-white transition-colors"
                aria-label="Add to wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-gold text-rose-gold' : ''}`} />
              </button>
              <button
                onClick={handleAddToCart}
                className="w-9 h-9 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-rose-gold hover:text-white transition-colors"
                aria-label="Add to cart"
              >
                <ShoppingBag className="w-4 h-4" />
              </button>
            </motion.div>

            {product.stock <= 5 && product.stock > 0 && (
              <div className="absolute bottom-3 left-3">
                <Badge variant="sale">Only {product.stock} left</Badge>
              </div>
            )}
          </div>

          <div className="p-4 space-y-2">
            {product.category && (
              <p className="text-[10px] uppercase tracking-widest text-premium-gray">{product.category.name}</p>
            )}
            <h3 className="font-serif text-base md:text-lg text-premium-black group-hover:text-rose-gold transition-colors line-clamp-1">
              {product.name}
            </h3>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-champagne text-champagne" />
              <span className="text-xs text-premium-gray">{product.rating} ({product.reviewCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-premium-black">
                {formatPrice(product.discountedPrice || product.price)}
              </span>
              {product.discountedPrice && (
                <span className="text-sm text-premium-gray line-through">{formatPrice(product.price)}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

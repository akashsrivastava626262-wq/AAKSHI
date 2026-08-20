'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const COLLECTIONS = [
  {
    title: 'Korean Jewellery',
    subtitle: 'Trendy & Minimal',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
    href: '/collections/korean-jewellery',
    color: 'from-rose-gold/80',
  },
  {
    title: 'Anti-Tarnish',
    subtitle: 'Long-Lasting Shine',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
    href: '/collections/anti-tarnish',
    color: 'from-champagne/80',
  },
  {
    title: 'Earrings',
    subtitle: 'Statement Pieces',
    image: 'https://images.unsplash.com/photo-1588444837495-c5d2b152aabb?w=800&q=80',
    href: '/collections/earrings',
    color: 'from-premium-black/80',
  },
  {
    title: 'Necklaces',
    subtitle: 'Elegant Layers',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
    href: '/collections/necklaces',
    color: 'from-rose-gold-dark/80',
  },
];

export default function FeaturedCollections() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs uppercase tracking-[0.3em] text-rose-gold mb-3"
          >
            Curated For You
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-3xl md:text-4xl lg:text-5xl text-premium-black mb-4"
          >
            Featured Collections
          </motion.h2>
          <div className="section-divider" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {COLLECTIONS.map((collection, index) => (
            <motion.div
              key={collection.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={collection.href} className="group block relative overflow-hidden aspect-[3/4]">
                <Image
                  src={collection.image}
                  alt={collection.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${collection.color} to-transparent opacity-60 group-hover:opacity-80 transition-opacity`} />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <p className="text-xs uppercase tracking-widest text-white/70 mb-1">{collection.subtitle}</p>
                  <h3 className="font-serif text-xl md:text-2xl mb-3">{collection.title}</h3>
                  <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest group-hover:gap-3 transition-all">
                    Shop Now <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

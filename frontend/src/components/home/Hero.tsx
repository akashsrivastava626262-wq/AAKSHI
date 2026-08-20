'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';

const HERO_SLIDES = [
  {
    title: 'Timeless Elegance,\nModern Style',
    subtitle: 'Discover our exquisite Korean Collection — where tradition meets contemporary fashion',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&q=80',
    cta: { text: 'Shop Now', href: '/shop' },
    secondary: { text: 'New Collection', href: '/shop?newArrival=true' },
  },
  {
    title: 'Anti-Tarnish\nGuarantee',
    subtitle: 'Jewellery that stays beautiful — 2 year anti-tarnish promise on every piece',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1920&q=80',
    cta: { text: 'Explore Now', href: '/collections/anti-tarnish' },
    secondary: { text: 'Learn More', href: '/#why-choose-us' },
  },
  {
    title: 'Every Piece Tells\nA Story',
    subtitle: 'Handcrafted with love for the modern, fashion-conscious woman',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1920&q=80',
    cta: { text: 'Shop Best Sellers', href: '/shop?bestSeller=true' },
    secondary: { text: 'View Lookbook', href: '/shop' },
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[current];

  return (
    <section className="relative h-[85vh] min-h-[600px] max-h-[900px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-xl text-white"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 mb-4"
            >
              <Sparkles className="w-4 h-4 text-champagne" />
              <span className="text-xs uppercase tracking-[0.3em] text-champagne">Premium Jewellery</span>
            </motion.div>

            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] mb-6 whitespace-pre-line">
              {slide.title}
            </h2>

            <p className="text-sm md:text-base text-white/80 leading-relaxed mb-8 max-w-md">
              {slide.subtitle}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href={slide.cta.href}>
                <Button variant="luxury" size="lg">{slide.cta.text}</Button>
              </Link>
              <Link href={slide.secondary.href}>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-premium-black">
                  {slide.secondary.text}
                </Button>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <button
          onClick={() => setCurrent((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
          className="w-10 h-10 border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-8 h-0.5 transition-all ${i === current ? 'bg-white w-12' : 'bg-white/40'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={() => setCurrent((prev) => (prev + 1) % HERO_SLIDES.length)}
          className="w-10 h-10 border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}

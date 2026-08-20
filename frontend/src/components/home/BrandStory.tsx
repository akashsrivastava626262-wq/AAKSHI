'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function BrandStory() {
  return (
    <section id="brand-story" className="py-20 md:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-rose-gold">Our Story</p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-premium-black leading-tight">
              Crafted With Love,<br />Worn With Pride
            </h2>
            <div className="section-divider !mx-0" />
            <div className="space-y-4 text-premium-gray leading-relaxed">
              <p>
                AAKSHI was born from a simple belief — every woman deserves to feel beautiful, confident, and elegant without breaking the bank. We set out to create premium fashion jewellery that rivals luxury brands in quality and design, while remaining accessible to the modern Indian woman.
              </p>
              <p>
                From our signature Korean collection inspired by Seoul&apos;s trendsetting fashion scene, to our revolutionary anti-tarnish technology that keeps your jewellery shining for years — every piece in our collection is thoughtfully designed and rigorously quality-tested.
              </p>
              <p>
                Today, AAKSHI is trusted by thousands of women across India who choose us for our premium quality, elegant designs, and exceptional customer experience.
              </p>
            </div>
            <div className="flex gap-8 pt-4">
              <div>
                <p className="font-serif text-3xl text-rose-gold">10K+</p>
                <p className="text-xs text-premium-gray uppercase tracking-wider">Happy Customers</p>
              </div>
              <div>
                <p className="font-serif text-3xl text-rose-gold">500+</p>
                <p className="text-xs text-premium-gray uppercase tracking-wider">Unique Designs</p>
              </div>
              <div>
                <p className="font-serif text-3xl text-rose-gold">4.8★</p>
                <p className="text-xs text-premium-gray uppercase tracking-wider">Average Rating</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80"
                alt="AAKSHI Brand Story"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-beige hidden md:block -z-10" />
            <div className="absolute -top-6 -right-6 w-32 h-32 border-2 border-rose-gold/20 hidden md:block" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

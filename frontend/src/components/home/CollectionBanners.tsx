'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

interface CollectionBannerProps {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  href: string;
  reversed?: boolean;
}

function CollectionBanner({ title, subtitle, description, image, href, reversed }: CollectionBannerProps) {
  return (
    <section className="py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${reversed ? 'lg:direction-rtl' : ''}`}>
          <motion.div
            initial={{ opacity: 0, x: reversed ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={`relative aspect-[4/5] overflow-hidden ${reversed ? 'lg:order-2' : ''}`}
          >
            <Image src={image} alt={title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: reversed ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={`space-y-6 ${reversed ? 'lg:order-1' : ''}`}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-rose-gold">{subtitle}</p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-premium-black">{title}</h2>
            <div className="section-divider !mx-0" />
            <p className="text-premium-gray leading-relaxed max-w-md">{description}</p>
            <Link href={href}>
              <Button variant="primary" size="lg">Explore Collection</Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function KoreanCollection() {
  return (
    <CollectionBanner
      title="Korean Jewellery Collection"
      subtitle="Trending Now"
      description="Discover the latest Korean-inspired jewellery trends. From delicate threader earrings to layered necklaces, our Korean collection brings Seoul's fashion-forward aesthetic to your jewellery box."
      image="https://images.unsplash.com/photo-1615651818470-4c4b8d5e2f1a?w=800&q=80"
      href="/collections/korean-jewellery"
    />
  );
}

export function AntiTarnishCollection() {
  return (
    <CollectionBanner
      title="Anti-Tarnish Collection"
      subtitle="Built to Last"
      description="Our premium anti-tarnish jewellery features advanced PVD coating technology that keeps your pieces shining like new for years. Backed by our 2-year anti-tarnish guarantee — because your jewellery deserves to stay beautiful."
      image="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80"
      href="/collections/anti-tarnish"
      reversed
    />
  );
}

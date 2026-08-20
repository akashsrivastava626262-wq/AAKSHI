'use client';

import { motion } from 'framer-motion';
import { Shield, Gift, RefreshCw, Truck, Award, Headphones, Sparkles } from 'lucide-react';
import { TRUST_BADGES } from '@/lib/utils';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield, Gift, RefreshCw, Truck, Award, Headphones, Sparkles,
};

export default function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="py-20 md:py-28 bg-premium-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-rose-gold mb-3">Why AAKSHI</p>
          <h2 className="font-serif text-3xl md:text-4xl text-premium-black mb-4">Why Choose AAKSHI</h2>
          <div className="section-divider" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {TRUST_BADGES.map((badge, index) => {
            const Icon = ICON_MAP[badge.icon];
            return (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="text-center space-y-3 p-4"
              >
                <div className="w-14 h-14 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm">
                  {Icon && <Icon className="w-6 h-6 text-rose-gold" />}
                </div>
                <h3 className="text-sm font-semibold text-premium-black">{badge.title}</h3>
                <p className="text-xs text-premium-gray">{badge.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function TrustBadges() {
  return (
    <div className="border-y border-beige bg-white py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-xs text-premium-gray">
          {TRUST_BADGES.slice(0, 5).map((badge) => (
            <span key={badge.title} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-rose-gold rounded-full" />
              {badge.title}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

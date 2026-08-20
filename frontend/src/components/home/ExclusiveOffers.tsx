'use client';

import { motion } from 'framer-motion';
import { Tag, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const OFFERS = [
  { code: 'AAKSHI10', discount: '10% OFF', description: 'On all orders above ₹499', minOrder: '₹499' },
  { code: 'WELCOME20', discount: '20% OFF', description: 'First order special', minOrder: '₹999' },
  { code: 'FLAT100', discount: '₹100 OFF', description: 'Flat discount on orders', minOrder: '₹799' },
];

export default function ExclusiveOffers() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    toast.success(`Code ${code} copied!`);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-rose-gold/5 via-beige/30 to-champagne/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-rose-gold mb-3">Special Deals</p>
          <h2 className="font-serif text-3xl md:text-4xl text-premium-black mb-4">Exclusive Offers</h2>
          <div className="section-divider" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {OFFERS.map((offer, index) => (
            <motion.div
              key={offer.code}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 text-center space-y-4 border border-beige hover:border-rose-gold/30 hover:shadow-lg transition-all"
            >
              <Tag className="w-8 h-8 text-rose-gold mx-auto" />
              <p className="font-serif text-3xl text-rose-gold">{offer.discount}</p>
              <p className="text-sm text-premium-gray">{offer.description}</p>
              <p className="text-xs text-premium-gray">Min. order: {offer.minOrder}</p>
              <button
                onClick={() => copyCode(offer.code)}
                className="inline-flex items-center gap-2 px-6 py-2 border-2 border-dashed border-rose-gold/40 text-sm font-semibold tracking-widest text-rose-gold hover:bg-rose-gold hover:text-white transition-colors"
              >
                {copied === offer.code ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {offer.code}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

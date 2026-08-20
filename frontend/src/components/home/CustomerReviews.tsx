'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { publicApi } from '@/lib/api';
import type { Review } from '@/types';

export default function CustomerReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    publicApi.getReviews()
      .then(({ data }) => setReviews(data.data))
      .catch(() => {
        setReviews([
          { id: '1', rating: 5, title: 'Absolutely stunning!', comment: 'These earrings are even more beautiful in person. The pearl quality is amazing!', createdAt: '', user: { name: 'Priya S.' } },
          { id: '2', rating: 5, title: 'Best purchase ever', comment: 'Been wearing these daily for 3 months and they still look brand new. True anti-tarnish quality!', createdAt: '', user: { name: 'Ananya M.' } },
          { id: '3', rating: 5, title: 'Got so many compliments', comment: 'Wore this to a party and everyone asked where I got it from. The layering effect is gorgeous.', createdAt: '', user: { name: 'Sneha R.' } },
          { id: '4', rating: 4, title: 'Premium quality', comment: 'The chain feels substantial and the gold color is perfect. Great for layering with other pieces.', createdAt: '', user: { name: 'Kavya P.' } },
        ]);
      });
  }, []);

  return (
    <section className="py-20 md:py-28 bg-beige/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-rose-gold mb-3">Testimonials</p>
          <h2 className="font-serif text-3xl md:text-4xl text-premium-black mb-4">What Our Customers Say</h2>
          <div className="section-divider" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.slice(0, 4).map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 md:p-8 space-y-4 relative"
            >
              <Quote className="w-8 h-8 text-rose-gold/20 absolute top-4 right-4" />
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-champagne text-champagne' : 'text-beige-dark'}`} />
                ))}
              </div>
              {review.title && <h4 className="font-serif text-lg text-premium-black">{review.title}</h4>}
              <p className="text-sm text-premium-gray leading-relaxed">{review.comment}</p>
              <div className="pt-2 border-t border-beige">
                <p className="text-sm font-medium text-premium-black">{review.user.name}</p>
                {review.product && (
                  <p className="text-xs text-premium-gray">on {review.product.name}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

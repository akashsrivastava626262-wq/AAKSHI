'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { orderApi } from '@/lib/api';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await orderApi.subscribeNewsletter(email);
      toast.success('Welcome to the AAKSHI family!');
      setEmail('');
    } catch {
      toast.error('Subscription failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 md:py-28 bg-premium-black text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <Mail className="w-10 h-10 text-champagne mx-auto" />
          <h2 className="font-serif text-3xl md:text-4xl">Join the AAKSHI Family</h2>
          <p className="text-white/60 max-w-md mx-auto">
            Subscribe to get exclusive offers, new collection alerts, and styling tips delivered to your inbox.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto pt-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/40"
            />
            <Button type="submit" variant="luxury" isLoading={loading} className="whitespace-nowrap">
              Subscribe
            </Button>
          </form>
          <p className="text-xs text-white/30">Get 10% off your first order when you subscribe</p>
        </motion.div>
      </div>
    </section>
  );
}

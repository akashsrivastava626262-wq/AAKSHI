import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

const FOOTER_LINKS = {
  shop: [
    { label: 'All Products', href: '/shop' },
    { label: 'Earrings', href: '/collections/earrings' },
    { label: 'Necklaces', href: '/collections/necklaces' },
    { label: 'Korean Collection', href: '/collections/korean-jewellery' },
    { label: 'Anti-Tarnish', href: '/collections/anti-tarnish' },
    { label: 'New Arrivals', href: '/shop?sort=newest&newArrival=true' },
  ],
  help: [
    { label: 'Track Order', href: '/track-order' },
    { label: 'Shipping Info', href: '/shipping' },
    { label: 'Returns & Exchanges', href: '/returns' },
    { label: 'Size Guide', href: '/size-guide' },
    { label: 'Care Instructions', href: '/care' },
    { label: 'FAQ', href: '/#faq' },
  ],
  company: [
    { label: 'About AAKSHI', href: '/about' },
    { label: 'Our Story', href: '/#brand-story' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-premium-black text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl tracking-[0.3em]">AAKSHI</h2>
            <p className="text-sm text-white/60 leading-relaxed">
              Premium fashion jewellery crafted for the modern woman. Timeless elegance meets contemporary style.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com/aakshi" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-rose-gold-light transition-colors text-xs uppercase tracking-wider" aria-label="Instagram">
                IG
              </a>
              <a href="https://facebook.com/aakshi" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-rose-gold-light transition-colors text-xs uppercase tracking-wider" aria-label="Facebook">
                FB
              </a>
              <a href="https://twitter.com/aakshi" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-rose-gold-light transition-colors text-xs uppercase tracking-wider" aria-label="Twitter">
                X
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-champagne mb-4">Shop</h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-champagne mb-4">Help</h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.help.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-champagne mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-white/60">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>hello@aakshi.com</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/60">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/60">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Mumbai, Maharashtra, India</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payment & Trust */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-xs text-white/40">
              <span>100% Secure Payments</span>
              <span>•</span>
              <span>Easy Returns</span>
              <span>•</span>
              <span>Anti-Tarnish Guarantee</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-white/40">
              <span>UPI</span>
              <span>•</span>
              <span>Visa</span>
              <span>•</span>
              <span>Mastercard</span>
              <span>•</span>
              <span>Razorpay</span>
              <span>•</span>
              <span>Stripe</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 text-center text-xs text-white/30">
          © {new Date().getFullYear()} AAKSHI. All rights reserved. Crafted with love for every woman.
        </div>
      </div>
    </footer>
  );
}

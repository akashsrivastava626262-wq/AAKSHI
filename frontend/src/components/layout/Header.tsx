'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ShoppingBag, Heart, User, Menu, X, ChevronDown
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import { logout } from '@/store/authSlice';
import { productApi } from '@/lib/api';
import type { Product } from '@/types';

const NAV_LINKS = [
  { label: 'Shop All', href: '/shop' },
  { label: 'Earrings', href: '/collections/earrings' },
  { label: 'Necklaces', href: '/collections/necklaces' },
  { label: 'Korean Collection', href: '/collections/korean-jewellery' },
  { label: 'Anti-Tarnish', href: '/collections/anti-tarnish' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { itemCount } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        try {
          const { data } = await productApi.search(searchQuery);
          setSearchResults(data.data);
        } catch {
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-premium-black text-white text-center py-2 text-xs tracking-widest">
        ✨ FREE SHIPPING ON ORDERS ABOVE ₹999 | USE CODE <span className="text-champagne font-semibold">AAKSHI10</span> FOR 10% OFF ✨
      </div>

      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile Menu */}
            <button
              className="lg:hidden p-2"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <h1 className="font-serif text-2xl md:text-3xl tracking-[0.3em] text-premium-black">
                AAKSHI
              </h1>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs uppercase tracking-widest text-premium-gray hover:text-rose-gold transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3 md:gap-4">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 hover:text-rose-gold transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <Link href="/wishlist" className="p-2 hover:text-rose-gold transition-colors hidden sm:block">
                <Heart className="w-5 h-5" />
              </Link>
              <Link href="/cart" className="p-2 hover:text-rose-gold transition-colors relative">
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-gold text-white text-[10px] flex items-center justify-center rounded-full">
                    {itemCount}
                  </span>
                )}
              </Link>
              {isAuthenticated ? (
                <div className="relative group">
                  <button className="p-2 hover:text-rose-gold transition-colors">
                    <User className="w-5 h-5" />
                  </button>
                  <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="bg-white shadow-lg border border-beige min-w-[180px] py-2">
                      <p className="px-4 py-2 text-xs text-premium-gray border-b border-beige">Hi, {user?.name?.split(' ')[0]}</p>
                      <Link href="/account" className="block px-4 py-2 text-sm hover:bg-beige transition-colors">My Account</Link>
                      <Link href="/orders" className="block px-4 py-2 text-sm hover:bg-beige transition-colors">My Orders</Link>
                      {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
                        <Link href="/admin" className="block px-4 py-2 text-sm hover:bg-beige transition-colors text-rose-gold">Admin Panel</Link>
                      )}
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm hover:bg-beige transition-colors text-red-500">
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link href="/login" className="p-2 hover:text-rose-gold transition-colors">
                  <User className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-beige overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-premium-gray" />
                  <input
                    type="text"
                    placeholder="Search for earrings, necklaces, korean jewellery..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-beige/50 border-0 focus:outline-none focus:ring-1 focus:ring-rose-gold text-sm"
                    autoFocus
                  />
                </div>
                {searchResults.length > 0 && (
                  <div className="mt-2 bg-white shadow-lg max-h-64 overflow-y-auto">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        onClick={() => { setShowSearch(false); setSearchQuery(''); }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-beige transition-colors"
                      >
                        <img src={product.images[0]} alt={product.name} className="w-10 h-10 object-cover" />
                        <div>
                          <p className="text-sm font-medium">{product.name}</p>
                          <p className="text-xs text-premium-gray">₹{product.discountedPrice || product.price}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 shadow-xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-beige">
                <span className="font-serif text-xl tracking-[0.2em]">AAKSHI</span>
                <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="p-4 space-y-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-3 px-4 text-sm uppercase tracking-widest hover:bg-beige transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-beige mt-4 pt-4">
                  <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 px-4 text-sm hover:bg-beige">Wishlist</Link>
                  <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 px-4 text-sm hover:bg-beige">Cart ({itemCount})</Link>
                  {isAuthenticated ? (
                    <>
                      <Link href="/account" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 px-4 text-sm hover:bg-beige">My Account</Link>
                      <Link href="/orders" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 px-4 text-sm hover:bg-beige">My Orders</Link>
                    </>
                  ) : (
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 px-4 text-sm hover:bg-beige">Login / Register</Link>
                  )}
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

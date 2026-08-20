import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/providers/Providers';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: {
    default: 'AAKSHI — Premium Fashion Jewellery',
    template: '%s | AAKSHI',
  },
  description: 'Discover premium fashion jewellery at AAKSHI. Shop Korean jewellery, anti-tarnish earrings, elegant necklaces & more. Free shipping above ₹999.',
  keywords: ['jewellery', 'fashion jewellery', 'korean jewellery', 'anti-tarnish', 'earrings', 'necklaces', 'AAKSHI'],
  authors: [{ name: 'AAKSHI' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://aakshi.com',
    siteName: 'AAKSHI',
    title: 'AAKSHI — Premium Fashion Jewellery',
    description: 'Discover premium fashion jewellery at AAKSHI. Shop Korean jewellery, anti-tarnish earrings, elegant necklaces & more.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'AAKSHI Premium Jewellery' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AAKSHI — Premium Fashion Jewellery',
    description: 'Discover premium fashion jewellery at AAKSHI.',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://aakshi.com'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'AAKSHI',
              url: 'https://aakshi.com',
              logo: 'https://aakshi.com/logo.png',
              description: 'Premium fashion jewellery brand',
              sameAs: ['https://instagram.com/aakshi', 'https://facebook.com/aakshi'],
            }),
          }}
        />
      </head>
      <body className="antialiased">
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

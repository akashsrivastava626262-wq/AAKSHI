import { SAMPLE_PRODUCTS } from '@/lib/sampleData';

export function generateStaticParams() {
  return SAMPLE_PRODUCTS.map((product) => ({ slug: product.slug }));
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return children;
}

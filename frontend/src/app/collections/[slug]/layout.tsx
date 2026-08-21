export function generateStaticParams() {
  return [
    { slug: 'earrings' },
    { slug: 'necklaces' },
    { slug: 'korean-jewellery' },
    { slug: 'anti-tarnish' },
  ];
}

export default function CollectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}

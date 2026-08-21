export function generateStaticParams() {
  return [{ id: 'demo' }];
}

export default function OrderLayout({ children }: { children: React.ReactNode }) {
  return children;
}

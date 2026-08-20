import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'sale' | 'new' | 'bestseller';
  className?: string;
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-beige text-premium-black',
    sale: 'bg-rose-gold text-white',
    new: 'bg-champagne text-premium-black',
    bestseller: 'bg-premium-black text-white',
  };

  return (
    <span className={cn('inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider', variants[variant], className)}>
      {children}
    </span>
  );
}

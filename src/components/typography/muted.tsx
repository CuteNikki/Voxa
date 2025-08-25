import { cn } from '@/lib/utils';

export function TypographyMuted({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <span className={cn('text-muted-foreground text-sm', className)}>{children}</span>;
}

import { cn } from '@/lib/utils';

export function TypographyP({
  children,
  className,
  ...props
}: { children?: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('leading-7', className)} {...props}>
      {children}
    </p>
  );
}

import { TypographyH1 } from '@/components/typography/h1';
import { TypographyP } from '@/components/typography/p';

export default function NotFound() {
  return (
    <div className='flex flex-1 flex-col items-center justify-center text-center'>
      <div className='text-muted-foreground mb-8 animate-pulse text-9xl font-bold'>404</div>
      <div className='flex flex-col items-center gap-4'>
        <TypographyH1>Oops! Page Not Found</TypographyH1>
        <TypographyP>Looks like you tried to chat with a page that doesn&apos;t exist.</TypographyP>
      </div>
    </div>
  );
}

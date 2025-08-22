'use client';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as React from 'react';

import { cn } from '@/lib/utils';

function TooltipProvider({ delayDuration = 0, ...props }: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return <TooltipPrimitive.Provider data-slot='tooltip-provider' delayDuration={delayDuration} {...props} />;
}

function Tooltip({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot='tooltip' {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot='tooltip-trigger' {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  variant = 'primary',
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content> & { variant?: 'primary' | 'secondary' }) {
  const baseClasses =
    'animate-in border fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance';
  const variantClasses = variant === 'secondary' ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground';
  const arrowVariantClasses = variant === 'secondary' ? 'bg-muted fill-muted' : 'bg-primary fill-primary';

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content data-slot='tooltip-content' sideOffset={sideOffset} className={cn(baseClasses, variantClasses, className)} {...props}>
        {children}
        <TooltipPrimitive.Arrow className={cn(arrowVariantClasses, 'z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px] border-r border-b')} />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };

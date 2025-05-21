import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

export function Collapsible({
  open,
  onOpenChange,
  className,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  className?: string
  children: React.ReactNode
}) {
  return <div className={cn('w-full', className)}>{children}</div>;
}

export function CollapsibleTrigger({
  asChild,
  children,
}: {
  asChild: boolean
  children: React.ReactNode
}) {
  return <>{children}</>;
}

export function CollapsibleContent({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight)
    }
  }, []);

  return (
    <div
      ref={contentRef}
      style={{ maxHeight: height }}
      className={cn('overflow-hidden transition-all duration-300', className)}
    >
      {children}
    </div>
  );
}
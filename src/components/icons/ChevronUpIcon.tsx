import { cn } from '@/lib/utils';

export function ChevronUpIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={cn('h-6 w-6', className)}
    >
      <path d='m18 15-6-6-6 6' />
    </svg>
  );
}

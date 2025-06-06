import { cn } from '@/lib/utils';

export function ScrollIcon({ className }: { className?: string }) {
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
      <path d='M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4' />
      <path d='M19 17V5a2 2 0 0 0-2-2H4' />
    </svg>
  );
}

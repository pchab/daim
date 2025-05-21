import { cn } from '@/lib/utils';

export function Button({
  children,
  className,
  type = 'button',
  disabled = false,
  variant = 'default',
  onClick,
}: {
  children: React.ReactNode
  className?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  variant?: 'default' | 'outline'
  onClick?: () => void
}) {
  const baseStyles =
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  const variantStyles = {
    default: 'bg-amber-600 hover:bg-amber-700 text-white',
    outline: 'border border-amber-700/50 bg-gray-800/50 hover:bg-gray-700/50 text-gray-100',
  };

  return (
    <button
      type={type}
      className={cn(baseStyles, variantStyles[variant], className)}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
import React from 'react'

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  loading?: boolean
  leftIcon?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  'aria-label'?: string
}

export const PrimaryButton = React.forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ children, loading, leftIcon, className = '', disabled, size = 'md', ...props }, ref) => {
    const sizeClasses = {
      sm: 'px-3 py-2 text-sm min-h-[36px]',
      md: 'px-4 py-3 text-base min-h-[44px]',
      lg: 'px-6 py-4 text-lg min-h-[52px]'
    }

    return (
      <button
        ref={ref}
        className={`
          inline-flex items-center justify-center gap-2
          rounded-md font-semibold text-white
          bg-gradient-to-r from-blue-600 to-indigo-600
          shadow-sm transition-all duration-150
          hover:from-blue-700 hover:to-indigo-700
          focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
          disabled:opacity-60 disabled:cursor-not-allowed
          touch-manipulation active:scale-95
          ${sizeClasses[size]}
          ${className}
        `}
        disabled={disabled || loading}
        aria-label={props['aria-label']}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        )}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
      </button>
    )
  }
)

PrimaryButton.displayName = 'PrimaryButton' 
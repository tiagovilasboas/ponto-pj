import { Card, Text } from '@mantine/core'
import type { IconProps } from '@tabler/icons-react'

interface SquareCTAProps {
  icon: React.ComponentType<IconProps>
  title: string
  subtitle?: string
  onClick: () => void
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'red'
  disabled?: boolean
  loading?: boolean
}

const colorClasses = {
  blue: 'bg-gradient-to-br from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 text-blue-800 border-blue-200',
  green: 'bg-gradient-to-br from-emerald-100 to-emerald-200 hover:from-emerald-200 hover:to-emerald-300 text-emerald-800 border-emerald-200',
  orange: 'bg-gradient-to-br from-amber-100 to-amber-200 hover:from-amber-200 hover:to-amber-300 text-amber-800 border-amber-200',
  purple: 'bg-gradient-to-br from-violet-100 to-violet-200 hover:from-violet-200 hover:to-violet-300 text-violet-800 border-violet-200',
  red: 'bg-gradient-to-br from-rose-100 to-rose-200 hover:from-rose-200 hover:to-rose-300 text-rose-800 border-rose-200'
}

export const SquareCTA = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  onClick, 
  color = 'blue',
  disabled = false,
  loading = false
}: SquareCTAProps) => {
  return (
    <Card
      withBorder
      className={`
        aspect-square cursor-pointer transition-all duration-200
        ${colorClasses[color]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-lg'}
        ${loading ? 'animate-pulse' : ''}
      `}
      onClick={disabled || loading ? undefined : onClick}
      p="md"
    >
      <div className="h-full flex flex-col justify-center items-center text-center">
        <Icon size={32} className="mb-3" />
        <Text size="sm" fw={600} className="mb-1">
          {title}
        </Text>
        {subtitle && (
          <Text size="xs" opacity={0.7}>
            {subtitle}
          </Text>
        )}
      </div>
    </Card>
  )
} 
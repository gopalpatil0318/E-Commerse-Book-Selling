import React from 'react'

interface RoundLoaderProps {
  size?: number
  color?: string
  borderWidth?: number
}

export const RoundLoader: React.FC<RoundLoaderProps> = ({
  size = 40,
  color = "#3B82F6",
  borderWidth = 4
}) => {
  return (
    <div className="relative">
      <div 
        className="animate-spin rounded-full border-t-transparent"
        style={{
          width: size,
          height: size,
          borderColor: color,
          borderWidth: borderWidth,
        }}
      />
      <div 
        className="absolute top-0 left-0 rounded-full"
        style={{
          width: size,
          height: size,
          borderColor: `${color}33`, // 20% opacity of the main color
          borderWidth: borderWidth,
          animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}
      />
    </div>
  )
}


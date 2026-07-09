'use client'

import {
  Dumbbell,
  Zap,
  Users,
  Trophy,
  Target,
  Smartphone,
  Gift,
  Brain,
  Gem,
  Handshake,
  LucideIcon,
} from 'lucide-react'

interface IconRendererProps {
  icon: string
  size?: number
  className?: string
}

const iconMap: Record<string, LucideIcon> = {
  '🏋️': Dumbbell,
  '🧘': Zap,
  '✨': Zap,
  '👥': Users,
  '🏆': Trophy,
  '🎯': Target,
  '📱': Smartphone,
  '🎁': Gift,
  '🧠': Brain,
  '💎': Gem,
  '🤝': Handshake,
  '1️⃣': Users,
  '💑': Users,
}

export default function IconRenderer({
  icon,
  size = 24,
  className = 'text-primary',
}: IconRendererProps) {
  const IconComponent = iconMap[icon]

  if (!IconComponent) {
    return null
  }

  return <IconComponent size={size} className={className} />
}

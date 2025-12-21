# Data Model: Refactor Dashboard Root

## Entities

### UserProgress
*Derived from Gamification/Development module*
- `level`: number
- `currentXp`: number
- `nextLevelXp`: number
- `streak`: number
- `activeModule`: Module (optional)

### StrengthProfile
*Derived from Assessment module*
- `topStrengths`: Array<{
  id: string
  name: string
  description: string
  color: string // 'Emerald' | 'Amber' | 'Purple'
}>

### ModuleRecommendation
*Derived from AI/Development module*
- `id`: string
- `title`: string
- `description`: string
- `type`: 'challenge' | 'module' | 'path'
- `reason`: string (AI generated reason)

## Component Interfaces

### CyberCardProps
- `children`: ReactNode
- `variant`: 'default' | 'glow' | 'alert'
- `className`: string

### HeroSectionProps
- `user`: User
- `progress`: UserProgress

### StrengthsListProps
- `strengths`: StrengthProfile['topStrengths']

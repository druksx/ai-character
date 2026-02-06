'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, ChefHat, Users } from 'lucide-react'

interface RecipeCardProps {
  name: string
  cuisine: string
  difficulty: 'easy' | 'medium' | 'hard'
  prepTimeMinutes: number
  cookTimeMinutes: number
  servings: number
  ingredients: { item: string; quantity: string; unit: string }[]
  steps: string[]
}

const difficultyColor = {
  easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
} as const

export function RecipeCard(props: RecipeCardProps) {
  const totalTime = props.prepTimeMinutes + props.cookTimeMinutes

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg leading-tight">{props.name}</CardTitle>
          <Badge variant="outline" className={difficultyColor[props.difficulty]}>
            {props.difficulty}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" aria-hidden="true" />
            {totalTime} min
          </span>
          <span className="flex items-center gap-1">
            <Users className="size-3.5" aria-hidden="true" />
            {props.servings}
          </span>
          <span className="flex items-center gap-1">
            <ChefHat className="size-3.5" aria-hidden="true" />
            {props.cuisine}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="mb-2 text-sm font-semibold">Ingredients</h4>
          <ul className="grid gap-1 text-sm">
            {props.ingredients.map((ing, i) => (
              <li key={i} className="flex gap-1">
                <span className="text-muted-foreground">{ing.quantity} {ing.unit}</span>
                <span>{ing.item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-2 text-sm font-semibold">Steps</h4>
          <ol className="grid gap-2 text-sm">
            {props.steps.map((step, i) => (
              <li key={i} className="flex gap-2">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}

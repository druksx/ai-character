'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Clock, ChefHat, Users, Flame, Bookmark, Trash2 } from 'lucide-react'
import { useState } from 'react'

interface RecipeCardProps {
  name: string
  cuisine: string
  difficulty: 'easy' | 'medium' | 'hard'
  prepTimeMinutes: number
  cookTimeMinutes: number
  servings: number
  ingredients: { item: string; quantity: string; unit: string }[]
  steps: string[]
  onSave?: () => void
  onDelete?: () => void
}

const difficultyConfig = {
  easy: { label: 'Easy', className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
  medium: { label: 'Medium', className: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300' },
  hard: { label: 'Hard', className: 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300' },
} as const

function ucfirst(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function RecipeCard(props: RecipeCardProps) {
  const [saved, setSaved] = useState(false)
  const totalTime = props.prepTimeMinutes + props.cookTimeMinutes
  const config = difficultyConfig[props.difficulty]

  function handleSave() {
    props.onSave?.()
    setSaved(true)
  }

  return (
    <div className="w-full max-w-lg overflow-hidden rounded-xl border border-primary/15 bg-card shadow-sm">
      <div className="bg-primary/5 px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold leading-tight">{props.name}</h3>
          <Badge variant="outline" className={config.className}>
            {config.label}
          </Badge>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5" aria-hidden="true" />
            {totalTime} min
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="size-3.5" aria-hidden="true" />
            {props.servings} servings
          </span>
          <span className="flex items-center gap-1.5">
            <ChefHat className="size-3.5" aria-hidden="true" />
            {props.cuisine}
          </span>
        </div>
      </div>

      <div className="px-5 py-4">
        <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Flame className="size-3.5" aria-hidden="true" />
          Ingredients
        </h4>
        <ul className="mt-2.5 grid gap-1 text-sm">
          {props.ingredients.map((ing, i) => (
            <li key={i} className="flex items-baseline gap-2">
              <span className="size-1.5 shrink-0 translate-y-[-1px] rounded-full bg-primary/40" aria-hidden="true" />
              <span className="font-medium">{ucfirst(ing.item)}</span>
              <span className="ml-auto shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-xs tabular-nums text-muted-foreground">
                {ucfirst(ing.quantity)} {ing.unit}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <Separator className="mx-5 w-auto" />

      <div className="px-5 py-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Steps
        </h4>
        <ol className="mt-2.5 grid gap-3 text-sm">
          {props.steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                {i + 1}
              </span>
              <span className="pt-0.5 leading-relaxed">{ucfirst(step)}</span>
            </li>
          ))}
        </ol>
      </div>

      {(props.onSave || props.onDelete) && (
        <>
          <Separator className="mx-5 w-auto" />
          <div className="flex gap-2 px-5 py-3">
            {props.onSave && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                disabled={saved}
                className="flex-1 gap-2"
              >
                <Bookmark className={`size-4 ${saved ? 'fill-current' : ''}`} />
                {saved ? 'Saved!' : 'Save Recipe'}
              </Button>
            )}
            {props.onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={props.onDelete}
                className="gap-2 text-muted-foreground hover:border-destructive/50 hover:text-destructive"
              >
                <Trash2 className="size-4" />
                Delete
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

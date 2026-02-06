'use client'

import type { SousChefMessage } from '@/lib/ai/types'
import { RecipeCard } from '@/components/tools/recipe-card'
import { NutritionLabel } from '@/components/tools/nutrition-label'
import { SubstitutionCard } from '@/components/tools/substitution-card'

type Part = SousChefMessage['parts'][number]

export function MessagePart({ part }: { part: Part }) {
  switch (part.type) {
    case 'text':
      return <p className="whitespace-pre-wrap">{part.text}</p>

    case 'tool-getRecipe':
      if (part.state === 'input-available' || part.state === 'output-available') {
        return <RecipeCard {...part.input} />
      }
      return <ToolLoading />

    case 'tool-calculateNutrition':
      if (part.state === 'input-available' || part.state === 'output-available') {
        return <NutritionLabel {...part.input} />
      }
      return <ToolLoading />

    case 'tool-substituteIngredient':
      if (part.state === 'input-available' || part.state === 'output-available') {
        return <SubstitutionCard {...part.input} />
      }
      return <ToolLoading />

    default:
      return null
  }
}

function ToolLoading() {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground" aria-live="polite">
      <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      Preparing...
    </div>
  )
}

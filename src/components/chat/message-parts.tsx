'use client'

import type { SousChefMessage } from '@/lib/ai/types'
import { MessageResponse } from '@/components/ai-elements/message'
import {
  Reasoning,
  ReasoningTrigger,
  ReasoningContent,
} from '@/components/ai-elements/reasoning'
import { Shimmer } from '@/components/ai-elements/shimmer'
import { RecipeCard } from '@/components/tools/recipe-card'
import { NutritionLabel } from '@/components/tools/nutrition-label'
import { SubstitutionCard } from '@/components/tools/substitution-card'

type Part = SousChefMessage['parts'][number]

interface MessagePartProps {
  part: Part
  savedRecipeNames?: Set<string>
  onSaveRecipe?: (recipe: Record<string, unknown>) => void
}

export function MessagePart({ part, savedRecipeNames, onSaveRecipe }: MessagePartProps) {
  switch (part.type) {
    case 'text':
      return <MessageResponse>{part.text}</MessageResponse>

    case 'reasoning':
      if (part.state !== 'streaming' && !part.text) return null
      return (
        <Reasoning isStreaming={part.state === 'streaming'}>
          <ReasoningTrigger />
          {part.text && <ReasoningContent>{part.text}</ReasoningContent>}
        </Reasoning>
      )

    case 'tool-getRecipe':
      if (part.state === 'input-available' || part.state === 'output-available') {
        const alreadySaved = savedRecipeNames?.has(part.input.name) ?? false
        return (
          <RecipeCard
            {...part.input}
            initialSaved={alreadySaved}
            onSave={!alreadySaved && onSaveRecipe ? () => onSaveRecipe(part.input) : undefined}
          />
        )
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
      <Shimmer duration={1.5}>Preparing...</Shimmer>
    </div>
  )
}

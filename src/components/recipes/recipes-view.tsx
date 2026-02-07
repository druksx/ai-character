'use client'

import { useState, useMemo } from 'react'
import { RecipeCard } from '@/components/tools/recipe-card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Flame } from 'lucide-react'
import type { SavedRecipeRow } from '@/lib/supabase/types'

interface RecipesViewProps {
  recipes: SavedRecipeRow[]
  stats: { cuisine: string; recipe_count: number }[]
}

export function RecipesView({ recipes, stats }: RecipesViewProps) {
  const [cuisineFilter, setCuisineFilter] = useState<string>('all')
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all')

  const cuisines = useMemo(
    () => [...new Set(recipes.map((r) => r.cuisine))].sort(),
    [recipes],
  )

  const filtered = useMemo(
    () =>
      recipes.filter((r) => {
        if (cuisineFilter !== 'all' && r.cuisine !== cuisineFilter) return false
        if (difficultyFilter !== 'all' && r.difficulty !== difficultyFilter)
          return false
        return true
      }),
    [recipes, cuisineFilter, difficultyFilter],
  )

  return (
    <div className="space-y-8">
      {/* Top Cuisines Stats */}
      {stats.length > 0 && (
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <Flame className="size-4" />
            Top Cuisines
          </h2>
          <div className="flex flex-wrap gap-2">
            {stats.map((s) => (
              <button
                key={s.cuisine}
                onClick={() =>
                  setCuisineFilter(
                    cuisineFilter === s.cuisine ? 'all' : s.cuisine,
                  )
                }
              >
                <Badge
                  variant={cuisineFilter === s.cuisine ? 'default' : 'outline'}
                  className="cursor-pointer gap-1.5 px-3 py-1.5 text-sm transition-colors hover:bg-primary/10"
                >
                  {s.cuisine}
                  <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-primary">
                    {s.recipe_count}
                  </span>
                </Badge>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Dropdown Filters */}
      <section className="flex flex-wrap items-center gap-3">
        <Select value={cuisineFilter} onValueChange={setCuisineFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Cuisine" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All cuisines</SelectItem>
            {cuisines.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All levels</SelectItem>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>

        {(cuisineFilter !== 'all' || difficultyFilter !== 'all') && (
          <span className="text-xs text-muted-foreground">
            {filtered.length} recipe{filtered.length !== 1 ? 's' : ''}
          </span>
        )}
      </section>

      {/* Recipe Grid — items-start prevents cards from stretching to match tallest sibling */}
      {filtered.length > 0 ? (
        <div className="grid items-start gap-6 sm:grid-cols-2">
          {filtered.map((r) => (
            <RecipeCard
              key={r.id}
              name={r.name}
              cuisine={r.cuisine}
              difficulty={r.difficulty}
              prepTimeMinutes={r.prep_time_minutes}
              cookTimeMinutes={r.cook_time_minutes}
              servings={r.servings}
              ingredients={r.ingredients as RecipeCardIngredient[]}
              steps={r.steps as string[]}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-3xl">
            📖
          </div>
          <p className="text-sm text-muted-foreground">
            {recipes.length === 0
              ? 'No saved recipes yet. Ask Le Sous-Chef for a recipe and save it!'
              : 'No recipes match the current filters.'}
          </p>
        </div>
      )}
    </div>
  )
}

type RecipeCardIngredient = { item: string; quantity: string; unit: string }

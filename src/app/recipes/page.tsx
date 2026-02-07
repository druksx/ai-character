import type { Metadata } from 'next'
import Link from 'next/link'
import { listSavedRecipes } from '@/lib/supabase/queries'
import { RecipesView } from '@/components/recipes/recipes-view'
import { ArrowLeft, Bookmark } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Saved Recipes — Le Sous-Chef',
  description: 'Browse your saved recipes from Le Sous-Chef.',
}

export default async function RecipesPage() {
  const recipes = await listSavedRecipes()

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <Link
            href="/"
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
            aria-label="Back to chat"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Bookmark className="size-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-semibold leading-tight">
              Saved Recipes
            </h1>
            <p className="text-xs text-muted-foreground">
              {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} saved
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        <RecipesView initialRecipes={recipes} />
      </main>
    </div>
  )
}

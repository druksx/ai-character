'use client'

import { Separator } from '@/components/ui/separator'
import { Apple } from 'lucide-react'

interface NutritionLabelProps {
  dishName: string
  servingSize: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  sugar: number
}

function MacroBar({ label, value, unit = 'g', color, max }: {
  label: string
  value: number
  unit?: string
  color: string
  max: number
}) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="tabular-nums text-muted-foreground">{value}{unit}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function Row({ label, value, unit = 'g', indent = false }: {
  label: string
  value: number
  unit?: string
  indent?: boolean
}) {
  return (
    <div className={`flex justify-between py-1 text-sm ${indent ? 'pl-4 text-muted-foreground' : ''}`}>
      <span>{label}</span>
      <span className="tabular-nums">{value}{unit}</span>
    </div>
  )
}

export function NutritionLabel(props: NutritionLabelProps) {
  const maxMacro = Math.max(props.protein, props.carbs, props.fat, 1)

  return (
    <div className="w-full max-w-sm overflow-hidden rounded-xl border border-primary/15 bg-card shadow-sm">
      <div className="flex items-center gap-3 bg-primary/5 px-5 py-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Apple className="size-5 text-primary" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold leading-tight">{props.dishName}</h3>
          <p className="text-xs text-muted-foreground">{props.servingSize} per serving</p>
        </div>
      </div>

      <div className="px-5 py-4">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">Calories</span>
          <span className="text-3xl font-bold tabular-nums">{props.calories}</span>
        </div>

        <Separator className="my-3" />

        <div className="grid gap-3">
          <MacroBar label="Protein" value={props.protein} color="bg-amber-500" max={maxMacro} />
          <MacroBar label="Carbs" value={props.carbs} color="bg-primary/70" max={maxMacro} />
          <MacroBar label="Fat" value={props.fat} color="bg-rose-400" max={maxMacro} />
        </div>

        <Separator className="my-3" />

        <div className="divide-y divide-border/50">
          <Row label="Dietary Fiber" value={props.fiber} />
          <Row label="Sugars" value={props.sugar} />
        </div>
      </div>
    </div>
  )
}

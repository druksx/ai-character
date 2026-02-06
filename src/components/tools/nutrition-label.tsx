'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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

function Row({ label, value, unit = 'g', bold = false }: { label: string; value: number; unit?: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between py-1 ${bold ? 'font-bold' : ''}`}>
      <span>{label}</span>
      <span>{value}{unit}</span>
    </div>
  )
}

export function NutritionLabel(props: NutritionLabelProps) {
  return (
    <Card className="w-full max-w-xs font-mono">
      <CardHeader className="pb-1">
        <CardTitle className="text-lg">Nutrition Facts</CardTitle>
        <p className="text-xs text-muted-foreground">{props.dishName}</p>
      </CardHeader>
      <CardContent className="space-y-0 text-sm">
        <div className="border-b-4 border-foreground pb-1 text-xs text-muted-foreground">
          Serving size: {props.servingSize}
        </div>
        <div className="border-b-8 border-foreground py-1">
          <div className="text-xs">Amount per serving</div>
          <div className="flex justify-between text-2xl font-black">
            <span>Calories</span>
            <span>{props.calories}</span>
          </div>
        </div>
        <div className="divide-y text-sm">
          <Row label="Total Fat" value={props.fat} bold />
          <Row label="Total Carbs" value={props.carbs} bold />
          <div className="pl-4">
            <Row label="Dietary Fiber" value={props.fiber} />
            <Row label="Sugars" value={props.sugar} />
          </div>
          <Row label="Protein" value={props.protein} bold />
        </div>
      </CardContent>
    </Card>
  )
}

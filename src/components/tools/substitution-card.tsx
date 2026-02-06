'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'

interface SubstitutionCardProps {
  original: string
  reason: string
  substitutes: {
    name: string
    ratio: string
    notes: string
    quality: 'perfect' | 'good' | 'acceptable'
  }[]
}

const qualityConfig = {
  perfect: { label: 'Perfect', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  good: { label: 'Good', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
  acceptable: { label: 'Acceptable', className: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
} as const

export function SubstitutionCard(props: SubstitutionCardProps) {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="line-through opacity-60">{props.original}</span>
          <ArrowRight className="size-4 text-muted-foreground" aria-hidden="true" />
          <span>Substitutes</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">{props.reason}</p>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-3">
          {props.substitutes.map((sub, i) => {
            const config = qualityConfig[sub.quality]
            return (
              <li key={i} className="flex items-start gap-3 rounded-md border p-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{sub.name}</span>
                    <Badge variant="outline" className={config.className}>
                      {config.label}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {sub.ratio} &middot; {sub.notes}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}

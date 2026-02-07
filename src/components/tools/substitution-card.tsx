'use client'

import { Badge } from '@/components/ui/badge'
import { ArrowRightLeft } from 'lucide-react'

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
  perfect: { label: 'Perfect', className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
  good: { label: 'Good', className: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300' },
  acceptable: { label: 'Acceptable', className: 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300' },
} as const

function ucfirst(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function SubstitutionCard(props: SubstitutionCardProps) {
  return (
    <div className="w-full max-w-lg overflow-hidden rounded-xl border border-primary/15 bg-card shadow-sm">
      <div className="flex items-center gap-3 bg-primary/5 px-5 py-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <ArrowRightLeft className="size-5 text-primary" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold leading-tight">
            Substitutes for <span className="text-primary">{ucfirst(props.original)}</span>
          </h3>
          <p className="text-xs text-muted-foreground">{ucfirst(props.reason)}</p>
        </div>
      </div>

      <ul className="grid gap-2 px-5 py-4">
        {props.substitutes.map((sub, i) => {
          const config = qualityConfig[sub.quality]
          return (
            <li key={i} className="rounded-lg bg-muted/50 p-3">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{ucfirst(sub.name)}</span>
                <Badge variant="outline" className={config.className}>
                  {config.label}
                </Badge>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground/70">{ucfirst(sub.ratio)}</span>
                {' '}&middot;{' '}{ucfirst(sub.notes)}
              </p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

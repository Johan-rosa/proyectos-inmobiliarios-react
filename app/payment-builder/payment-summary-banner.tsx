"use client"

import { formatNumber } from "@/lib/utils"

interface Stat {
  id: number
  name: string
  value: number
}

interface SummaryBannerProps {
  stats: Stat[]
  clientName?: string
  projectName?: string
  unit?: string
  currency?: string
}

export default function SummaryBanner({ stats, clientName, projectName, unit, currency }: SummaryBannerProps) {

  return (
    <div className="my-4">
      <div className="w-full flex gap-4 justify-between items-center mb-4 pr-3">
        <h2 className="text-base sm:text-xl font-semibold text-foreground">{clientName}</h2>
        {projectName && <p className="text-base sm:text-xl text-muted-foreground">
          {projectName}
          {unit && <span>, Unidad {unit}</span>}
          
        </p>}
      </div>
      <dl className="grid grid-cols-2 gap-1 sm:gap-2 overflow-hidden rounded-lg text-center sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="flex flex-col bg-primary/5 dark:bg-primary/10 p-3 sm:p-6 rounded-md transition-colors hover:bg-primary/10 dark:hover:bg-primary/15"
          >
            <dt className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">{stat.name}</dt>
            <dd className="text-base sm:text-xl font-semibold tracking-tight text-foreground">{currency} {formatNumber(stat.value)}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

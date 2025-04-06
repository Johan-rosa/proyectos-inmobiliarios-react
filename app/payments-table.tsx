"use client"

import React, { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { formatDate, createPpaymentPlanName } from "@/lib/utils"
import {DownloadButton} from "@/components/report-download-btn"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { 
  Edit, Eye, Plus, Receipt, 
  Signature, BrickWall, Handshake, 
  Calendar, ChevronUp, ChevronDown,
  MoreHorizontal,
} from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { PaymentPlanWithID } from "@/types"
import { 
  getPaymentPlans, 
  type PaymentPlanQueryOptions 
} from "@/services/payment-plan-service"
import type { PaymentPlan } from "@/types"
import type { QueryDocumentSnapshot, DocumentData } from "firebase/firestore"
import { toast } from "sonner"


export default function PaymentPlanTable() {
  const [isMobile, setIsMobile] = useState(false)
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [plans, setPlans] = useState<(PaymentPlan & { id: string })[]>([])
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [queryOptions, setQueryOptions] = useState<PaymentPlanQueryOptions>({
    pageSize: 10,
    sortBy: "createdAt",
    sortDirection: "desc"
  })

  console.log(isLoading, plans, lastDoc, hasMore, setQueryOptions, isMobile)

  // Load payment plans
  useEffect(() => {
    loadPaymentPlans()
  }, [queryOptions])

  const loadPaymentPlans = async (reset = false) => {
    setIsLoading(true)
    try {
      const options: PaymentPlanQueryOptions = {
        ...queryOptions,
        startAfterDoc: reset ? undefined : lastDoc || undefined
      }

      const result = await getPaymentPlans(options)
      
      setPlans(reset ? result.plans : [...plans, ...result.plans])
      setLastDoc(result.lastDoc)
      setHasMore(result.hasMore)
    } catch (error) {
      console.error("Error loading payment plans:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  if (isLoading) {
    return <PlanSkeleton />
  }

  if (!plans || plans.length === 0) {
    return <PlansEmptyState />
  }

  return (
    <>
      {/* Desktop view */}
      <div className="hidden md:block overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-10"></TableHead>
              <TableHead className="font-semibold">Cliente</TableHead>
              <TableHead>Proyecto</TableHead>
              <TableHead>Unidad</TableHead>
              <TableHead className="font-semibold">Precio</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((plan) => (
              <PlanTableRow
                key={plan.id}
                plan={plan}
                isExpanded={!!expandedRows[plan.id]}
                onToggle={() => toggleRow(plan.id)}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isExpanded={!!expandedRows[plan.id]}
            onToggle={() => toggleRow(plan.id)}
          />
        ))}
      </div>
    </>
  )
}

type PlanTableRowProps = {
  plan: PaymentPlanWithID
  isExpanded: boolean
  onToggle: () => void
}

export function PlanTableRow({ plan, isExpanded, onToggle }: PlanTableRowProps) {
  return (
    <React.Fragment>
      <TableRow className="hover:bg-muted/30">
        <TableCell>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onToggle}>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </TableCell>
        <TableCell className="font-medium">{plan.client}</TableCell>
        <TableCell className="text-muted-foreground">{plan.project}</TableCell>
        <TableCell>
          <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
            {plan.unit}
          </Badge>
        </TableCell>
        <TableCell className="font-semibold text-primary">
          {plan.price.toLocaleString("en-US", {
            style: "currency",
            currency: plan.currency,
          })}
        </TableCell>
        <TableCell className="text-right">
          <PaymentPlanDropdownActions
            planId={plan.id}
            reportName={createPpaymentPlanName(plan.client, plan.project, plan.unit)}
          />
        </TableCell>
      </TableRow>
      {isExpanded && (
        <TableRow className="bg-muted/20 border-t border-dashed">
          <TableCell colSpan={6} className="p-4 bg-muted/20">
            <ExpandedContent plan={plan} />
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  )
}

type PaymentPlanDropdownActionsProps = {
  planId: string
  reportName?: string
}

export function PaymentPlanDropdownActions({ planId, reportName }: PaymentPlanDropdownActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 mt-1">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Button
            variant="ghost"
            size="icon"
            className="w-full justify-start hover:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            onClick={() => toast.warning("Esta función no está disponible aún.")}
          >
            <Eye className="mr-2 h-4 w-4" /> <span>Ver detalles</span>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Button
            variant="ghost"
            size="icon"
            className="w-full justify-start hover:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            onClick={() => toast.warning("Esta función no está disponible aún.")}
          >
            <Edit className="mr-2 h-4 w-4" />
            <span>Editar</span>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <DownloadButton
            firebaseId={planId}
            label="Descargar"
            className="w-full justify-start"
            reportName={reportName}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

type ExpandedContentProps = {
  plan: PaymentPlanWithID
  isMobile?: boolean
}

export function ExpandedContent({ plan, isMobile = false }: ExpandedContentProps) {
  if (isMobile) {
    return (
      <div className="p-4 border-t bg-muted/5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <PaymentItems plan={plan} compact={true} />
          </div>
          <div>
            <KeyDates plan={plan} compact={true} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <PaymentItems plan={plan} />
      <Separator className="my-3" />
      <KeyDates plan={plan} />
    </div>
  )
}

type PlanCardProps = {
  plan: PaymentPlanWithID
  isExpanded: boolean
  onToggle: () => void
}

export function PlanCard({ plan, isExpanded, onToggle }: PlanCardProps) {
  return (
    <Card
      className={cn("overflow-hidden transition-colors p-1 rounded-md gap-2", isExpanded ? "border-primary/30" : "")}
    >
      <CardContent className="p-3">
        <div className="flex justify-between">
          <div className="space-y-1">
            <h3 className="font-medium">{plan.client}</h3>
            <div className="text-sm text-muted-foreground/80">
              <p>{plan.project}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs font-normal text-muted-foreground/80">
                  {plan.unit}
                </Badge>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold text-primary">
              {plan.price.toLocaleString("en-US", {
                style: "currency",
                currency: plan.currency,
              })}
            </p>
            <PaymentPlanDropdownActions
              planId={plan.id}
              reportName={createPpaymentPlanName(plan.client, plan.project, plan.unit)}
            />
          </div>
        </div>
      </CardContent>

      {/* Expansion footer */}
      <div className={cn("border-t transition-colors", isExpanded ? "bg-muted/20" : "bg-muted/10")}>
        <div className="py-2 px-4 flex items-center justify-center cursor-pointer" onClick={onToggle}>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80">
            <span>{isExpanded ? "Ocultar detalles" : "Ver detalles de pago"}</span>
            <ChevronDown className={cn("h-4 w-4 transition-transform", isExpanded ? "rotate-180" : "")} />
          </div>
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && <ExpandedContent plan={plan} isMobile={true} />}
    </Card>
  )
}

type PaymentItemProps = {
  icon: React.ReactNode
  title: string
  amount: number
  currency: string
  percentage: number
  compact?: boolean
}

export function PaymentItem({ icon, title, amount, currency, percentage, compact = false }: PaymentItemProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0">
        <div className="bg-primary/5 p-2 rounded-full">{icon}</div>
      </div>
      <div>
        <p className={cn("font-medium text-muted-foreground", compact ? "text-xs" : "text-sm")}>{title}</p>
        <div className="flex items-center gap-1">
          <span className={cn("font-medium", compact ? "text-sm" : "text-sm font-semibold")}>
            {amount.toLocaleString("en-US", {
              style: "currency",
              currency: currency,
            })}
          </span>
          <span className="text-xs text-muted-foreground/70">({percentage.toFixed(1)}%)</span>
        </div>
      </div>
    </div>
  )
}

export function PaymentItems({ plan, compact = false }: { plan: PaymentPlanWithID; compact?: boolean }) {
  return (
    <div className={cn("space-y-3", !compact && "md:grid md:grid-cols-3 md:gap-4 md:space-y-0")}>
      <PaymentItem
        icon={<Signature className="h-5 w-5 text-primary/70" />}
        title="Reserva y firma"
        amount={plan.signature + plan.reservation}
        currency={plan.currency}
        percentage={plan.reservationSignatuerPercent || plan.reservationPercent * 100}
        compact={compact}
      />

      <PaymentItem
        icon={<BrickWall className="h-5 w-5 text-primary/70" />}
        title="En cuotas"
        amount={plan.duringConstruction}
        currency={plan.currency}
        percentage={plan.duringConstructionPercent * 100 || plan.duringConstructionPercent}
        compact={compact}
      />

      <PaymentItem
        icon={<Handshake className="h-5 w-5 text-primary/70" />}
        title="Contra entrega"
        amount={plan.atDelivery}
        currency={plan.currency}
        percentage={plan.atDeliveryPercent * 100 || plan.atDeliveryPercent}
        compact={compact}
      />
    </div>
  )
}

type DateItemProps = {
  label: string
  date?: string | Date
  compact?: boolean
}

export function DateItem({ label, date, compact = false }: DateItemProps) {
  return (
    <div className={cn("flex items-center gap-2", compact ? "gap-2" : "gap-3")}>
      <div className="flex-shrink-0">
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-sm">{formatDate(date)}</p>
      </div>
    </div>
  )
}

export function KeyDates({
  plan,
  compact = false,
}: {
  plan: { reservationDate?: string | Date; signatureDate?: string | Date; deliveryDate?: string | Date }
  compact?: boolean
}) {
  return (
    <div className={cn("space-y-2", !compact && "md:grid md:grid-cols-3 md:gap-4 md:space-y-0")}>
      <DateItem label="Fecha reserva" date={plan.reservationDate} compact={compact} />
      <DateItem label="Fecha firma" date={plan.signatureDate} compact={compact} />
      <DateItem label="Fecha entrega" date={plan.deliveryDate} compact={compact} />
    </div>
  )
}


export function PlansEmptyState() {
  return (
    <div className="mt-24 flex items-center justify-center h-full w-full">
      <div className="mx-auto max-w-2xl w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
        <div className="flex flex-col items-center justify-center">
          <Receipt className="mx-auto h-12 w-12 text-gray-400" strokeWidth={1.5} />
          <span className="mt-4 block text-sm font-semibold text-gray-900">No se has creado ningún plan de pago</span>
          <p className="mt-1 text-sm text-gray-500">Crea tu primer plan de pago.</p>
          <Link href="/payment-builder" className="mt-6">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Crear plan de pago
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

import { Skeleton } from "@/components/ui/skeleton"

export function TableSkeleton() {
  return (
    <div className="hidden md:block overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-10"></TableHead>
            <TableHead className="font-semibold">Cliente</TableHead>
            <TableHead>Proyecto</TableHead>
            <TableHead>Unidad</TableHead>
            <TableHead className="font-semibold">Precio</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-8 w-8 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-40" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-16 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-24 ml-auto" />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end">
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="md:hidden space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-16 rounded-full mt-1" />
              </div>
              <div className="text-right">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-8 w-8 rounded-full mt-1 ml-auto" />
              </div>
            </div>
          </CardContent>
          <div className="border-t py-2 px-4 flex items-center justify-center">
            <Skeleton className="h-4 w-32" />
          </div>
        </Card>
      ))}
    </div>
  )
}

export function PlanSkeleton() {
  return (
    <>
      <TableSkeleton />
      <CardSkeleton />
    </>
  )
}


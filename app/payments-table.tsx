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
              <React.Fragment key={plan.id}>
                <TableRow className="hover:bg-muted/30">
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleRow(plan.id)}>
                      {expandedRows[plan.id] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
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
                  <PaymentPlanDropdownActions planId={plan.id} reportName={createPpaymentPlanName(plan.client, plan.project, plan.unit)} />
                  </TableCell>
                </TableRow>
                {expandedRows[plan.id] && (
                  <TableRow className="bg-muted/20 border-t border-dashed">
                    <TableCell colSpan={6} className="p-4 bg-muted/20">
                      <PaymentBreakdown plan={plan} />
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={cn("overflow-hidden transition-colors p-1 rounded-md gap-2", expandedRows[plan.id] ? "border-primary/30" : "")}
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
                  <PaymentPlanDropdownActions planId={plan.id} reportName={createPpaymentPlanName(plan.client, plan.project, plan.unit)} />
                </div>
              </div>
            </CardContent>

            {/* Expansion footer */}
            <div className={cn("border-t transition-colors", expandedRows[plan.id] ? "bg-muted/20" : "bg-muted/10")}>
              <div
                className="py-2 px-4 flex items-center justify-center cursor-pointer"
                onClick={() => toggleRow(plan.id)}
              >
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80">
                  <span>{expandedRows[plan.id] ? "Ocultar detalles" : "Ver detalles de pago"}</span>
                  <ChevronDown
                    className={cn("h-4 w-4 transition-transform", expandedRows[plan.id] ? "rotate-180" : "")}
                  />
                </div>
              </div>
            </div>

            {/* Expanded content */}
            {expandedRows[plan.id] && (
              <div className="p-4 border-t bg-muted/5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <div className="bg-primary/5 p-2 rounded-full">
                          <Signature className="h-5 w-5 text-primary/70" />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Reserva y firma</p>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium">
                            {(plan.signature + plan.reservation).toLocaleString("en-US", {
                              style: "currency",
                              currency: plan.currency,
                            })}
                          </span>
                          <span className="text-xs text-muted-foreground/70">
                            ({(plan.reservationPercent * 100).toFixed(0)}%)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <div className="bg-primary/5 p-2 rounded-full">
                          <BrickWall className="h-5 w-5 text-primary/70" />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">En cuotas</p>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium">
                            {plan.duringConstruction.toLocaleString("en-US", {
                              style: "currency",
                              currency: plan.currency,
                            })}
                          </span>
                          <span className="text-xs text-muted-foreground/70">
                            ({(plan.duringConstructionPercent * 100).toFixed(0)}%)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <div className="bg-primary/5 p-2 rounded-full">
                          <Handshake className="h-5 w-5 text-primary/70" />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Contra entrega</p>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium">
                            {plan.atDelivery.toLocaleString("en-US", {
                              style: "currency",
                              currency: plan.currency,
                            })}
                          </span>
                          <span className="text-xs text-muted-foreground/70">
                            ({(plan.atDeliveryPercent * 100).toFixed(0)}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <KeyDates plan={plan} />
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </>
  )
}

type PaymentPlanDropdownActionsProps = {
  planId: string,
  reportName?: string,
}


function PaymentPlanDropdownActions ({ planId, reportName}: PaymentPlanDropdownActionsProps) {
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
            <Eye className="mr-2 h-4 w-4" /> <span>Editar</span>
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
          <DownloadButton firebaseId={planId} label="Descargar" className="w-full justify-start" reportName={reportName} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function PaymentBreakdown({ plan }: { plan: PaymentPlanWithID }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="bg-primary/5 p-2 rounded-full">
              <Signature className="h-5 w-5 text-primary/70" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Reserva y firma</p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">
                {(plan.signature + plan.reservation).toLocaleString("en-US", {
                  style: "currency",
                  currency: plan.currency,
                })}
              </span>
              <span className="text-xs text-muted-foreground/70">({(plan.reservationPercent * 100).toFixed(0)}%)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="bg-primary/5 p-2 rounded-full">
              <BrickWall className="h-5 w-5 text-primary/70" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">En cuotas</p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">
                {plan.duringConstruction.toLocaleString("en-US", {
                  style: "currency",
                  currency: plan.currency,
                })}
              </span>
              <span className="text-xs text-muted-foreground/70">
                ({(plan.duringConstructionPercent * 100).toFixed(0)}%)
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="bg-primary/5 p-2 rounded-full">
              <Handshake className="h-5 w-5 text-primary/70" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Contra entrega</p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">
                {plan.atDelivery.toLocaleString("en-US", {
                  style: "currency",
                  currency: plan.currency,
                })}
              </span>
              <span className="text-xs text-muted-foreground/70">({(plan.atDeliveryPercent * 100).toFixed(0)}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key dates section */}
      <Separator className="my-3" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Fecha reserva</p>
            <p className="text-sm">{formatDate(plan.reservationDate)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Fecha firma</p>
            <p className="text-sm">{formatDate(plan.signatureDate)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Fecha entrega</p>
            <p className="text-sm">{formatDate(plan.deliveryDate)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function KeyDates({ plan }: { plan: PaymentPlanWithID }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <div>
          <p className="text-xs font-medium text-muted-foreground">Fecha reserva</p>
          <p className="text-sm">{formatDate(plan.reservationDate)}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <div>
          <p className="text-xs font-medium text-muted-foreground">Fecha firma</p>
          <p className="text-sm">{formatDate(plan.signatureDate)}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <div>
          <p className="text-xs font-medium text-muted-foreground">Fecha entrega</p>
          <p className="text-sm">{formatDate(plan.deliveryDate)}</p>
        </div>
      </div>
    </div>
  )
}

const PlansEmptyState = () => {
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

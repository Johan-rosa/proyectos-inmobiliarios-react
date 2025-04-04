"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  getPaymentPlans, 
  type PaymentPlanQueryOptions 
} from "@/services/payment-plan-service"
import { formatNumber } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Edit, Eye, FileText, SortAsc, SortDesc } from 'lucide-react'
import type { PaymentPlan } from "@/types"
import type { QueryDocumentSnapshot, DocumentData } from "firebase/firestore"

export default function PaymentPlansTable() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [plans, setPlans] = useState<(PaymentPlan & { id: string })[]>([])
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [queryOptions, setQueryOptions] = useState<PaymentPlanQueryOptions>({
    pageSize: 10,
    sortBy: "createdAt",
    sortDirection: "desc"
  })

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

  const handleSort = (sortBy: PaymentPlanQueryOptions["sortBy"]) => {
    setQueryOptions(prev => {
      const sortDirection = 
        prev.sortBy === sortBy && prev.sortDirection === "asc" ? "desc" : "asc"
      
      return {
        ...prev,
        sortBy,
        sortDirection
      }
    })
  }

  const handleViewPlan = (id: string) => {
    router.push(`/payment-plans/${id}`)
  }

  const handleEditPlan = (id: string) => {
    router.push(`/payment-plans/${id}/edit`)
  }

  const handleGenerateReport = (id: string) => {
    router.push(`/payment-plans/${id}/report`)
  }

  return (
    <div className="space-y-4">

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort("client")}
                >
                  Cliente
                  {queryOptions.sortBy === "client" && (
                    queryOptions.sortDirection === "asc" 
                      ? <SortAsc className="ml-1 h-4 w-4" /> 
                      : <SortDesc className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead>
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort("project")}
                >
                  Proyecto
                  {queryOptions.sortBy === "project" && (
                    queryOptions.sortDirection === "asc" 
                      ? <SortAsc className="ml-1 h-4 w-4" /> 
                      : <SortDesc className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="text-right">
                <div 
                  className="flex items-center justify-end cursor-pointer"
                  onClick={() => handleSort("price")}
                >
                  Precio
                  {queryOptions.sortBy === "price" && (
                    queryOptions.sortDirection === "asc" 
                      ? <SortAsc className="ml-1 h-4 w-4" /> 
                      : <SortDesc className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="hidden md:table-cell">
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort("createdAt")}
                >
                  Fecha
                  {queryOptions.sortBy === "createdAt" && (
                    queryOptions.sortDirection === "asc" 
                      ? <SortAsc className="ml-1 h-4 w-4" /> 
                      : <SortDesc className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && plans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Cargando planes de pago...
                </TableCell>
              </TableRow>
            ) : plans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No se encontraron planes de pago
                </TableCell>
              </TableRow>
            ) : (
              plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.client}</TableCell>
                  <TableCell>
                    {plan.project}
                    {plan.unit && <span className="text-muted-foreground ml-1">({plan.unit})</span>}
                  </TableCell>
                  <TableCell className="text-right">
                    {plan.currency} {formatNumber(plan.price)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {plan.createdAt ? format(plan.createdAt, "d MMM yyyy", { locale: es }) : "Fecha no disponible"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewPlan(plan.id)}
                        title="Ver detalles"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditPlan(plan.id)}
                        title="Editar plan"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleGenerateReport(plan.id)}
                        title="Generar reporte"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Mostrar
          </span>
          <Select
            value={queryOptions.pageSize?.toString()}
            onValueChange={(value) => 
              setQueryOptions(prev => ({ ...prev, pageSize: parseInt(value) }))
            }
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">
            por página
          </span>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadPaymentPlans(true)}
            disabled={isLoading || plans.length === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadPaymentPlans()}
            disabled={isLoading || !hasMore}
          >
            Siguiente
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}
"use client"

import { useState, useEffect } from "react"
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
  getPaymentPlans, 
  type PaymentPlanQueryOptions 
} from "@/services/payment-plan-service"
import { formatNumber } from "@/lib/utils"
import { Edit, Eye, Plus, Receipt } from 'lucide-react'
import type { PaymentPlan } from "@/types"
import type { QueryDocumentSnapshot, DocumentData } from "firebase/firestore"
import { toast } from "sonner"
import {DownloadButton} from "@/components/report-download-btn"
import Link from "next/link"

export default function PaymentPlansTable() {
  const [isLoading, setIsLoading] = useState(false)
  const [plans, setPlans] = useState<(PaymentPlan & { id: string })[]>([])
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null)
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
    } catch (error) {
      console.error("Error loading payment plans:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {!plans && <PlansEmptyState />}
      {plans && plans.length > 0 && (
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Proyecto</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Unidad</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>{plan.client}</TableCell>
                  <TableCell>{plan.project}</TableCell>
                  <TableCell>{plan.unit}</TableCell>
                  <TableCell>{formatNumber(plan.price)}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/payment-builder/${plan.id}`}>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/payment-builder/${plan.id}/edit`}>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    {/* Add download button */}
                    {/*<DownloadButton planId={plan.id} />*/}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
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

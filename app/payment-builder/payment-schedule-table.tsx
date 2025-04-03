"use client"

import { useEffect, useState } from "react"
import { format, addMonths, isBefore } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatNumber } from "@/lib/utils"

import type { Payment } from "@/types"

interface PaymentScheduleProps {
  firstPaymentDate: Date
  frequencyLabel: string
  cealingPayment: Date
  totalToPay: number
  payments: Payment[]
  setPayments: (payments: Payment[]) => void
}

export default function PaymentSchedule({
  firstPaymentDate = new Date(),
  frequencyLabel = "trimestral",
  cealingPayment = addMonths(new Date(), 12),
  totalToPay = 10000,
  payments = [],
  setPayments = () => {},
}: PaymentScheduleProps) {
  // Local state to prevent infinite loops
  const [localPayments, setLocalPayments] = useState<Payment[]>([])

  // Frequency mapping
  const frequencyMap: Record<string, number> = {
    mensual: 1,
    bimestral: 2,
    trimestral: 3,
    cuatrimestral: 4,
    semestral: 6,
  }
  const frequency = frequencyMap[frequencyLabel] || 3

  // Generate payment schedule when inputs change
  useEffect(() => {
    generatePaymentSchedule()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstPaymentDate, frequency, cealingPayment, totalToPay])

  // Sync local payments with parent when parent payments change
  useEffect(() => {
    if (payments.length > 0 && JSON.stringify(payments) !== JSON.stringify(localPayments)) {
      setLocalPayments(payments)
    }
  }, [payments])

  // Sync parent payments with local when local payments change
  useEffect(() => {
    if (localPayments.length > 0 && JSON.stringify(localPayments) !== JSON.stringify(payments)) {
      setPayments(localPayments)
    }
  }, [localPayments, setPayments])

  const generatePaymentSchedule = () => {
    // Skip if we already have payments and totalToPay is 0
    if (localPayments.length > 0 && totalToPay === 0) {
      return
    }

    const newPayments: Payment[] = []
    let currentDate = new Date(firstPaymentDate)
    let id = 1

    // Generate dates until ceiling date
    while (isBefore(currentDate, cealingPayment)) {
      newPayments.push({
        id,
        date: new Date(currentDate),
        ordinary: 0, // Will be calculated later
        extra: 0,
      })

      currentDate = addMonths(currentDate, frequency)
      id++
    }

    // If no payments to generate, don't update
    if (newPayments.length === 0) {
      return
    }

    // Calculate ordinary payments
    const totalExtra = newPayments.reduce((sum, payment) => sum + payment.extra, 0)
    const ordinaryAmount = newPayments.length > 0 ? (totalToPay - totalExtra) / newPayments.length : 0

    const updatedPayments = newPayments.map((payment) => ({
      ...payment,
      ordinary: Number(ordinaryAmount.toFixed(2)),
    }))

    // Only update local state if the payments have actually changed
    if (JSON.stringify(updatedPayments) !== JSON.stringify(localPayments)) {
      setLocalPayments(updatedPayments)
    }
  }

  // Handle date change
  const handleDateChange = (id: number, newDate: Date) => {
    const updatedPayments = localPayments.map((payment) =>
      payment.id === id ? { ...payment, date: newDate } : payment,
    )
    setLocalPayments(updatedPayments)
  }

  // Handle extra payment change
  const handleExtraChange = (id: number, value: string) => {
    const extraAmount = Number.parseFloat(value) || 0

    const updatedPayments = localPayments.map((payment) =>
      payment.id === id ? { ...payment, extra: extraAmount } : payment,
    )

    // Recalculate ordinary payments
    const totalExtra = updatedPayments.reduce((sum, payment) => sum + payment.extra, 0)
    const ordinaryAmount = updatedPayments.length > 0 ? (totalToPay - totalExtra) / updatedPayments.length : 0

    const finalPayments = updatedPayments.map((payment) => ({
      ...payment,
      ordinary: Number(ordinaryAmount.toFixed(2)),
    }))

    setLocalPayments(finalPayments)
  }

  // Use local payments for rendering
  const displayPayments = localPayments.length > 0 ? localPayments : payments

  // Calculate totals
  const totalOrdinary = displayPayments.reduce((sum, payment) => sum + payment.ordinary, 0)
  const totalExtra = displayPayments.reduce((sum, payment) => sum + payment.extra, 0)
  const grandTotal = totalOrdinary + totalExtra

  return (
    <div>
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px] sm:w-[80px] text-xs sm:text-sm px-1 sm:px-4 py-2 sm:py-3">No.</TableHead>
            <TableHead className="text-xs sm:text-sm px-1 sm:px-4 py-2 sm:py-3">Fecha</TableHead>
            <TableHead className="text-right text-xs sm:text-sm px-1 sm:px-4 py-2 sm:py-3">Cuota</TableHead>
            <TableHead className="text-right text-xs sm:text-sm px-1 sm:px-4 py-2 sm:py-3">Extra</TableHead>
            <TableHead className="text-right text-xs sm:text-sm px-1 sm:px-4 py-2 sm:py-3 hidden md:table-cell">
              Total
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayPayments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell className="px-1 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">{payment.id}</TableCell>
              <TableCell className="px-1 sm:px-4 py-2 sm:py-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-4",
                        !payment.date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      {payment.date ? format(payment.date, "d MMM yyyy", { locale: es }) : "Seleccionar"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={payment.date}
                      onSelect={(date) => date && handleDateChange(payment.id, date)}
                      initialFocus
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              </TableCell>
              <TableCell className="text-right px-1 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                {formatNumber(payment.ordinary)}
              </TableCell>
              <TableCell className="text-right px-1 sm:px-4 py-2 sm:py-3">
                <div className="flex justify-end">
                  <Input
                    type="number"
                    value={payment.extra || ""}
                    onChange={(e) => handleExtraChange(payment.id, e.target.value)}
                    className="w-16 sm:w-24 text-right text-xs sm:text-sm h-8 sm:h-10 px-1 sm:px-3"
                  />
                </div>
              </TableCell>
              <TableCell className="text-right font-medium px-1 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden md:table-cell">
                {(payment.ordinary + payment.extra).toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
          <TableRow className="bg-muted/50">
            <TableCell colSpan={2} className="font-medium px-1 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
              Total
            </TableCell>
            <TableCell className="text-right font-medium px-1 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
              ${formatNumber(totalOrdinary)}
            </TableCell>
            <TableCell className="text-right font-medium px-1 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
              ${formatNumber(totalExtra)}
            </TableCell>
            <TableCell className="text-right font-medium px-1 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden md:table-cell">
              ${formatNumber(grandTotal)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

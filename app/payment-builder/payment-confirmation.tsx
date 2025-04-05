"use client"

import { type ReactNode } from "react"
import { CircleDollarSign, FilePenLineIcon as Signature, BrickWall, Handshake } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

import { PaymentPlan } from "@/types"

// Individual payment item component
interface PaymentItemProps {
  icon: ReactNode
  label: string
  amount: number
  currency: string
  percentage?: number
  showPercentage?: boolean
}

export function PaymentItem({ icon, label, amount, currency, percentage, showPercentage = true }: PaymentItemProps) {
  return (
    <div className="flex items-center py-1">
      <dt className="flex items-center gap-2 text-sm font-medium leading-6 text-gray-500 w-40">
        <span className="flex items-center gap-1">
          {icon}
          {label}:
        </span>
      </dt>
      <dd className="flex items-center gap-1">
        <span className="text-sm font-semibold text-gray-700">
          {amount.toLocaleString("en-US", {
            style: "currency",
            currency: currency,
          })}
        </span>
        {showPercentage && percentage !== undefined && (
          <span className="ml-1 text-sm font-semibold text-gray-500">({(percentage * 100).toFixed(1)} %)</span>
        )}
      </dd>
    </div>
  )
}

// Payment plan description component
export function PaymentPlanDescription({ values, className }: { values: PaymentPlan; className?: string }) {
  return (
    <div className={cn("py-4", className)}>
      <p className="text-bold mb-1">{values.client}</p>
      <p className="font-light text-gray-500 text-sm">{`Proyecto ${values.project}, unidad: ${values.unit}`}</p>
      <dl className="mt-4 space-y-1">
        <PaymentItem
          icon={<CircleDollarSign className="h-5 w-5 text-gray-400" />}
          label="Precio de cierre"
          amount={values.price}
          currency={values.currency}
          showPercentage={false}
        />
        <PaymentItem
          icon={<Signature className="h-5 w-5 text-gray-400" />}
          label="Reserva y firma"
          amount={values.signature + values.reservation}
          currency={values.currency}
          percentage={values.reservationPercent}
        />
        <PaymentItem
          icon={<BrickWall className="h-5 w-5 text-gray-400" />}
          label="En cuotas"
          amount={values.duringConstruction}
          currency={values.currency}
          percentage={values.duringConstructionPercent}
        />
        <PaymentItem
          icon={<Handshake className="h-5 w-5 text-gray-400" />}
          label="Contra entrega"
          amount={values.atDelivery}
          currency={values.currency}
          percentage={values.atDeliveryPercent}
        />
      </dl>
    </div>
  )
}

// Save and discard buttons component
interface SaveDiscardButtonsProps {
  className?: string
  childClassName?: string
  toggleDiscardDialog: () => void
  toggleConfirmDialog: () => void
  isPending?: boolean
}

export function SaveDiscardButtons({
  className,
  toggleDiscardDialog,
  toggleConfirmDialog,
  isPending = false,
  childClassName,
}: SaveDiscardButtonsProps) {
  return (
    <div className={cn("flex gap-2", className)}>
      <Button className={cn(childClassName)} variant="outline" onClick={toggleDiscardDialog} disabled={isPending}>
        Descartar
      </Button>
      <Button className={cn(childClassName)} onClick={toggleConfirmDialog} disabled={isPending}>
        {isPending ? "Guardando..." : "Guardar"}
      </Button>
    </div>
  )
}

// Confirmation dialog component
interface ConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  values: PaymentPlan
}

export function ConfirmationDialog({ open, onOpenChange, onConfirm, values }: ConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmar antes de guardar</DialogTitle>
          <DialogDescription>Está seguro que desea guardar el plan de pago?</DialogDescription>
        </DialogHeader>
        <div className="rounded-md border bg-gray-50 p-4 my-2">
          <PaymentPlanDescription values={values} />
        </div>
        <DialogFooter>
          <Button type="button" onClick={onConfirm}>
            Guardar plan de pago
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Confirmation dialog component
interface DiscardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDiscard: () => void
  values: PaymentPlan
}

export function DiscardDialog({ open, onOpenChange, onDiscard, values }: DiscardDialogProps) {
  return (  
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Descartar</DialogTitle>
          <DialogDescription>Está seguro que desea descartar el plan de pago?</DialogDescription>
        </DialogHeader>
        <div className="rounded-md border bg-gray-50 p-4 my-2">
          <PaymentPlanDescription values={values} />
        </div>
        <DialogFooter>
          <Button variant="outline" type="button" onClick={onDiscard}>
            Descartar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

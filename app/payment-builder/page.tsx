"use client"

import { useState, useCallback, useTransition} from "react"
import { PageHeader } from "@/components/app-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PaymentBuilderInputs from "./payment-builder-inputs"
import PaymentTable from "./payment-schedule-table"
import SummaryBanner from "./payment-summary-banner"
import { toast } from "sonner"
import { savePaymentPlan } from "@/services/payment-plan-service"
import { validatePaymentConfiguration } from "./validate-payment-configuration"
import { SaveDiscardButtons, ConfirmationDialog, DiscardDialog } from "./payment-confirmation"
import CustomNumberInput from "@/components/custom-number-input"
import type { Payment } from "@/types"
import { Separator } from "@/components/ui/separator"
import { formatNumber } from "@/lib/utils"
import { DialogCuotaDeseada } from "./dialog-cuota-deseada"

const defaultValues = {
  client: "",
  project: "",
  unit: "",
  currency: "USD",
  price: 0,
  reservation: 0,
  signature: 0,
  reservationPercent: 5,
  signaturePercent: 5,
  reservationSignatuerPercent: 10,
  duringConstruction: 0,
  duringConstructionPercent: 40,
  atDelivery: 0,
  atDeliveryPercent: 50,
  deliveryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
  reservationDate: new Date(),
  signatureDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
  firstPaymentDate: new Date(new Date().setMonth(new Date().getMonth() + 2)),
  lastPaymentDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
  frequency: "trimestral",
  payments: [] as Payment[],
}

export default function PaymentBuilder() {
  const [paymentPlanValues, setPaymentPlanValues] = useState(defaultValues)
  const [nCuotasExtra, setnCuotasExtra] = useState(2)
  const [cuotaDeseada, setCuotaDeseada] = useState(0)

  const CalculoCuotaDeseada = () => {
    const duringConstruction = paymentPlanValues.duringConstruction
    const nCuotas = paymentPlanValues.payments.length
    const excedente = duringConstruction - nCuotas * cuotaDeseada
    const cuotaExtra = excedente / nCuotasExtra

    if (cuotaDeseada == 0 || nCuotasExtra <= 0) return
    if (excedente < 0) {
      return <p className="text-color-gray-400 text-sm my-2">{`La cuota deseada excedería el monto a pagar durante la construcción`}</p>
    }

    return (
      <p className="mb-4 text-color-gray-400 text-sm my-2">
        {`Para lograr una cutoa de ${formatNumber(cuotaDeseada)} se deben aportar ${formatNumber(excedente)} 
        extra: ${nCuotasExtra} pagos de ${formatNumber(cuotaExtra, )} cada uno`}
      </p>
    )
  }
  
  // State for loading indicators
  const [isPending, startTransition] = useTransition()
  const [isConfirmationDialogOpen, setConfirmationIsDialogOpen] = useState(false)
  const [isDiscardDialogOpen, setDiscardIsDialogOpen] = useState(false)

  const bannerStats = [
    { id: 1, name: "Precio de cierre", value: paymentPlanValues.price },
    { id: 2, name: "Reserva y firma", value: paymentPlanValues.reservation + paymentPlanValues.signature },
    { id: 3, name: "En cuotas", value: paymentPlanValues.duringConstruction },
    { id: 4, name: "Contra entrega", value: paymentPlanValues.atDelivery },
  ]

  const handlePaymentsChange = useCallback((payments: Payment[]) => {
    setPaymentPlanValues((prevValues) => {
      // Only update if the payments have actually changed
      if (JSON.stringify(prevValues.payments) === JSON.stringify(payments)) {
        return prevValues
      }
      return {
        ...prevValues,
        payments,
      }
    })
  }, [])

  const exportValues = useCallback((values: typeof paymentPlanValues) => {
    setPaymentPlanValues(values)
  }, [])

  // Handle saving the payment plan to Firebase
  const handleSavePaymentPlan = async () => {
    const isValid = validatePaymentConfiguration(paymentPlanValues)
    if (!isValid) return

    // Save to Firebase
    startTransition(async () => {
      try {
        const firebaseId = await savePaymentPlan(paymentPlanValues)

        fetch('/api/trigger-report', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ firebaseId }),
        })
        .catch(error => {
          console.error('Error calling trigger-report API:', error);
        });

        setPaymentPlanValues(defaultValues)
        setConfirmationIsDialogOpen(false)

        toast.success("Plan de pago guardado", {
          description: `Plan guardado con ID: ${firebaseId}`,
        })

        toast.info("Generando reporte", {
          description: "El reporte se generará en segundo plano y estará disponible para descargar en la sección de reportes en unos segundos.",
        })

      } catch (error) {
        console.error("Error saving payment plan:", error)
        toast.error("Error al guarder", {
          description: "Ocurrió un error al guardar el plan de pago"
        })
      }
    })
  }

  // Handle discarding changes
  const handleDiscard = () => {
    // Reset to default values
    setPaymentPlanValues(defaultValues)
    setDiscardIsDialogOpen(false)

    toast.success("Cambios descartados", {
      description: "Se han descartado todos los cambios",
    })
  }


  return (
    <>
      <PageHeader>
        <div className="w-full h-auto flex flex-wrap items-center justify-between p-2">
          <h1 className="text-xl font-medium">Crear plan de pago</h1>
          <div className="hidden sm:block">
            <SaveDiscardButtons
              isPending={isPending}
              toggleConfirmDialog={() => setConfirmationIsDialogOpen(true)}
              toggleDiscardDialog={() => setDiscardIsDialogOpen(true)}
            />
          </div>
        </div>
      </PageHeader>

      <div className="p-3 mx-auto max-w-3xl xl:hidden">
        <Tabs defaultValue="payment-inputs" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="payment-inputs">Configuración</TabsTrigger>
            <TabsTrigger value="plan">Plan de pago</TabsTrigger>
          </TabsList>
          <TabsContent className="max-w-2xl mx-auto" value="payment-inputs">
            <PaymentBuilderInputs values={paymentPlanValues} exportValues={exportValues} />
          </TabsContent>
          <TabsContent className="max-w-3xl" value="plan">
            <SummaryBanner
              stats={bannerStats}
              clientName={paymentPlanValues.client}
              projectName={paymentPlanValues.project}
              unit={paymentPlanValues.unit}
              currency={paymentPlanValues.currency}
            />
            <PaymentTable
              firstPaymentDate={paymentPlanValues.firstPaymentDate}
              frequencyLabel={paymentPlanValues.frequency}
              cealingPayment={paymentPlanValues.deliveryDate}
              totalToPay={paymentPlanValues.duringConstruction}
              setPayments={handlePaymentsChange}
              payments={paymentPlanValues.payments}
            />
            <DialogCuotaDeseada>
              <div className="flex gap-2">
                <CustomNumberInput
                  id="cuota-deseada-m"
                  label="Cuota deseada" 
                  value={cuotaDeseada.toFixed(1)} onChange={(value) => setCuotaDeseada(Number.parseFloat(value))}
                />
                <CustomNumberInput 
                  id="nCuotasExtra-m"
                  label="Cantidad de pagos extra" 
                  value={nCuotasExtra} onChange={(value) => setnCuotasExtra(Number.parseFloat(value))}
                />
              </div>
              <CalculoCuotaDeseada />
            </DialogCuotaDeseada>
          </TabsContent>
        </Tabs>
        <div className="sm:hidden block bg-gray-100 p-3 rounded-m mt-3">
          <SaveDiscardButtons
            className="flex-wrap"
            childClassName="w-full"

            toggleConfirmDialog={() => setConfirmationIsDialogOpen(true)}
            toggleDiscardDialog={() => setDiscardIsDialogOpen(true)}
          />  
        </div>
        <ConfirmationDialog
          open={isConfirmationDialogOpen}
          onOpenChange={() => setConfirmationIsDialogOpen(false)}
          onConfirm={handleSavePaymentPlan}
          values={paymentPlanValues}
        />
        <DiscardDialog
          open={isDiscardDialogOpen}
          onOpenChange={() => setDiscardIsDialogOpen(false)}
          onDiscard={handleDiscard}
          values={paymentPlanValues}
        />
      </div>

      <div className="p-2 hidden xl:grid grid-cols-[auto_1fr] gap-6 ">
        <div className="max-w-[450px] border-r border-r-gray-200 pr-4">
          <PaymentBuilderInputs values={paymentPlanValues} exportValues={exportValues} />
        </div>
        <div className="flex flex-col gap-2">
          <SummaryBanner
            stats={bannerStats}
            clientName={paymentPlanValues.client}
            projectName={paymentPlanValues.project}
            unit={paymentPlanValues.unit}
            currency={paymentPlanValues.currency}
          />
          <PaymentTable
            firstPaymentDate={paymentPlanValues.firstPaymentDate}
            frequencyLabel={paymentPlanValues.frequency}
            cealingPayment={paymentPlanValues.deliveryDate}
            totalToPay={paymentPlanValues.duringConstruction}
            setPayments={handlePaymentsChange}
            payments={paymentPlanValues.payments}
          />
          <Separator /> 
          <div className="flex gap-2">
            <CustomNumberInput
              id="cuota-deseada"
              label="Cuota deseada" 
              value={cuotaDeseada.toFixed(1)} onChange={(value) => setCuotaDeseada(Number.parseFloat(value))}
            />
            <CustomNumberInput
              id="nCuotasExtra"
              label="Cantidad de pagos extra" 
              value={nCuotasExtra} onChange={(value) => setnCuotasExtra(Number.parseFloat(value))}
            />
          </div>
          <CalculoCuotaDeseada />
        </div>
      </div>
    </>
  )
}
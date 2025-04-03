'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PaymentBuilderInputs from "./payment-builder-inputs";
import PaymentTable from "./payment-schedule-table";
import SummaryBanner from "./payment-summary-banner";

import { Payment } from "@/types";

export default function PaymentBuilder() {
  const [paymentPlanValues, setPaymentPlanValues] = useState({
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
    });

    const bannerStats = [
      { id: 1, name: "Precio de cierre", value: paymentPlanValues.price },
      { id: 2, name: "Reserva y firma", value: paymentPlanValues.reservation + paymentPlanValues.signature },
      { id: 3, name: "En cuotas", value: paymentPlanValues.duringConstruction},
      { id: 4, name: "Contra entrega", value: paymentPlanValues.atDelivery },
    ]

  const handlePaymentsChange = (payments: Payment[]) => {
    setPaymentPlanValues((prevValues) => ({
      ...prevValues,
      payments: payments,
  }))};

  return (
    <>
      <PageHeader>
        <div className="w-full h-auto  flex flex-wrap items-center justify-between p-2">
          <h1 className="text-xl font-medium">Crear plan de pago</h1>
          <div className="lg:flex flex-wrap gap-2 hidden">
            <Button variant="secondary">Descartar</Button>
            <Button>Guardar</Button>
          </div>
        </div>
      </PageHeader>

      <div className="p-3 mx-auto max-w-3xl xl:hidden">
        <Tabs defaultValue="payment-inputs" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="payment-inputs">Configuración</TabsTrigger>
            <TabsTrigger value="plan">Plan de pago</TabsTrigger>
          </TabsList>
          <TabsContent className="max-w-2xl mx-auto" value="payment-inputs" >
            <PaymentBuilderInputs values={paymentPlanValues} exportValues={setPaymentPlanValues} />
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
          </TabsContent>
        </Tabs>
      </div>

      <div className="p-2 hidden xl:grid grid-cols-[auto_1fr] gap-6 ">
        <div className="max-w-[450px] border-r border-r-gray-200 pr-4">
          <PaymentBuilderInputs values={paymentPlanValues} exportValues={setPaymentPlanValues} />
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
        </div>
      </div>
    </>
  );
};
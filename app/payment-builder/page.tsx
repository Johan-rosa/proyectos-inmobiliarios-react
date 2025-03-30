'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card";
import PaymentBuilderInputs from "./payment-builder-inputs";
import PaymentTable from "./payment-schedule-table";

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
    });

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

      <div className="p-3 mx-auto max-w-2xl xl:hidden">
        <Tabs defaultValue="payment-inputs" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="payment-inputs">Configuración</TabsTrigger>
            <TabsTrigger value="plan">Plan de pago</TabsTrigger>
          </TabsList>
          <TabsContent value="payment-inputs" >
            <PaymentBuilderInputs values={paymentPlanValues} exportValues={setPaymentPlanValues} />
          </TabsContent>
          <TabsContent value="plan">
            <h1>Resultdao del plan de pago</h1>
            <PaymentTable
              firstPaymentDate={paymentPlanValues.firstPaymentDate}
              frequencyLabel={paymentPlanValues.frequency}
              cealingPayment={paymentPlanValues.deliveryDate}
              totalToPay={paymentPlanValues.duringConstruction}
            />
          </TabsContent>
        </Tabs>
      </div>

      <div className="p-2 hidden xl:grid grid-cols-[auto_1fr] gap-4 ">
        <div className="max-w-[450px]">
          <Card>
            <CardContent>
            <PaymentBuilderInputs values={paymentPlanValues} exportValues={setPaymentPlanValues} />
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col gap-2">
          <h1>Resultdao del plan de pago</h1>
          <PaymentTable 
              firstPaymentDate={paymentPlanValues.firstPaymentDate}
              frequencyLabel={paymentPlanValues.frequency}
              cealingPayment={paymentPlanValues.deliveryDate}
              totalToPay={paymentPlanValues.duringConstruction}
          />
        </div>
      </div>
    </>
  );
};
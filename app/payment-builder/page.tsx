import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card";
import PaymentBuilderInputs from "./payment-builder-inputs";

export default function PaymentBuilder() {
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

      <div className="p-2">
        <Tabs defaultValue="payment-inputs" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="payment-inputs">Configuración</TabsTrigger>
            <TabsTrigger value="plan">Plan de pago</TabsTrigger>
          </TabsList>
          <TabsContent value="payment-inputs">
            <Card>
              <CardContent >
                <PaymentBuilderInputs />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="plan">
            <Card>
              <CardContent >
                Resultado del plan de pago
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};
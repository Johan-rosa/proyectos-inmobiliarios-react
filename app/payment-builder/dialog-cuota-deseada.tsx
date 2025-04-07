import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DialogCuotaDeseadaProps {
  children: React.ReactNode;
}

export function DialogCuotaDeseada({ children }: DialogCuotaDeseadaProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className=" mt-3 w-full" variant="outline">Calcular deseada</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cuál es la cuota deseada</DialogTitle>
          <DialogDescription>
            In troducir la cuota deseada y la cantidad de pago extraordinarios.
          </DialogDescription>
        </DialogHeader>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
}
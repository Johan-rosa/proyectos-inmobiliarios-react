import { toast } from "sonner"
import type { PaymentPlan } from "@/types"    

export const validatePaymentConfiguration = (plan: PaymentPlan) => {
    if (!plan.client) {
        toast.warning("Revisar configuración", {
        description: "El nombre del cliente es obligatorio"
        })
        return
    }

    if (plan.price <= 0) {
        toast.warning("Revisar configuaración", {
        description: "El precio debe ser mayor que cero"
        })
        return
    }

    if (
        (
        plan.reservationSignatuerPercent + 
        plan.duringConstructionPercent + 
        plan.atDeliveryPercent
        ) > 100
    ) {
        toast.warning("Revisar configuaración", {
        description: "El monto a pagar supera el precio de cierre"
        })
        return
    }

    if (plan.deliveryDate < plan.lastPaymentDate) {
        toast.warning("Revisar configuaración", {
        description: "La fecha de la última cuota debe ser previa a la fecha de entrega"
        })
        return
    }
}
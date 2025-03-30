'use client';
import {useState} from "react";
import CustomInput from "@/components/custom-input";
import DatePicker from "@/components/date-picker";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CustomNumberInput from "@/components/custom-number-input";

const PaymentBuilderInputs = () => {
  const [formInputs, setFormInputs] = useState({
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

  const onPriceChange = (value: string) => {
    const precio = parseFloat(value);

    if (!isNaN(precio) && precio > 0) {
      setFormInputs((prev) => {
        const calculatedReservation = Math.min(precio * (prev.reservationPercent / 100), 5000);
        const calculatedReservationPercent = calculatedReservation / precio * 100;
        const calculatedSignaturePercent = prev.reservationSignatuerPercent - calculatedReservationPercent;
        const calculatedSignature = precio * (calculatedSignaturePercent / 100);
        const calculatedDuringConstruction = precio * (prev.duringConstructionPercent / 100);
        const calculatedAtDelivery = precio * (prev.atDeliveryPercent / 100);

        return {
          ...prev,
          price: precio,
          reservation: calculatedReservation,
          reservationPercent: calculatedReservationPercent,
          signature: calculatedSignature,
          signaturePercent: calculatedSignaturePercent,
          reservationSignatuerPercent: calculatedReservationPercent + calculatedSignaturePercent,
          atDelivery: calculatedAtDelivery,
          duringConstruction: calculatedDuringConstruction,
        }
      });
    } else {
      setFormInputs((prev) => ({
        ...prev,
        price: 0,
        reservation: 0,
        reservationPercent: 5,
        signature: 0,
        signaturePercent: 5,
        reservationSignatuerPercent: 10,
        atDelivery: 0,
        atDeliveryPercent: 50,
        duringConstruction: 0,
        duringConstructionPercent: 40,
      }));
    }
  };

  const onReservationChange = (value: string) => {
    const reservation = Math.min(parseFloat(value), formInputs.price);
    if (!isNaN(reservation) && formInputs.price > 0) {
      setFormInputs((prev) => {
        const calculatedReservationPercent = reservation / prev.price * 100;
        const calculatedReservationSignaturePercent = prev.signaturePercent + calculatedReservationPercent;
        const calculateAtDeliveryPercent = 100 - calculatedReservationSignaturePercent - prev.duringConstructionPercent;
        const calculatedAtDelivery = prev.price * (calculateAtDeliveryPercent / 100);

        return {
          ...prev,
          reservation: reservation,
          reservationPercent: calculatedReservationPercent,
          reservationSignatuerPercent: calculatedReservationSignaturePercent,
          atDeliveryPercent: calculateAtDeliveryPercent,
          atDelivery: calculatedAtDelivery,
        }
      });
    };
  };

  const onSignatureChange = (value: string) => {
    const signature = Math.min(parseFloat(value), formInputs.price);

    if (!isNaN(signature) && formInputs.price > 0) {
      setFormInputs((prev) => {
        const calculatedSignaturePercent = signature / prev.price * 100;
        const calculatedReservationSignaturePercent = prev.reservationPercent + calculatedSignaturePercent;
        const calculateAtDeliveryPercent = 100 - calculatedReservationSignaturePercent - prev.duringConstructionPercent;
        const calculatedAtDelivery = prev.price * (calculateAtDeliveryPercent / 100);

        return {
          ...prev,
          signature: signature,
          signaturePercent: calculatedSignaturePercent,
          reservationSignatuerPercent: calculatedReservationSignaturePercent,
          atDeliveryPercent: calculateAtDeliveryPercent,
          atDelivery: calculatedAtDelivery,
        }
      });
    };
  };

  const onDuringConstructionChange = (value: string) => {
    const duringConstruction = Math.min(parseFloat(value), formInputs.price);

    if (!isNaN(duringConstruction) && formInputs.price > 0) {
      setFormInputs((prev) => {
        const calculatedDuringConstructionPercent = duringConstruction / prev.price * 100;
        const calculateAtDeliveryPercent = 100 - prev.reservationSignatuerPercent - calculatedDuringConstructionPercent;
        const calculatedAtDelivery = prev.price * (calculateAtDeliveryPercent / 100);

        return {
          ...prev,
          duringConstruction: duringConstruction,
          duringConstructionPercent: calculatedDuringConstructionPercent,
          atDeliveryPercent: calculateAtDeliveryPercent,
          atDelivery: calculatedAtDelivery,
        }
      });
    };
  };

  const onDuringConstructionPercentChange = (value: string) => {
    const duringConstructionPercent = Math.min(parseFloat(value), 100);
    if (!isNaN(duringConstructionPercent) && formInputs.price > 0) {
      setFormInputs((prev) => {
        const calculatedDuringConstruction = prev.price * (duringConstructionPercent / 100);
        const calculateAtDeliveryPercent = 100 - prev.reservationSignatuerPercent - duringConstructionPercent;
        const calculatedAtDelivery = prev.price * (calculateAtDeliveryPercent / 100);

        return {
          ...prev,
          duringConstruction: calculatedDuringConstruction,
          duringConstructionPercent: duringConstructionPercent,
          atDeliveryPercent: calculateAtDeliveryPercent,
          atDelivery: calculatedAtDelivery,
        }
      }
      );
    };
  };

  const onReservationSignaturePercentChange = (value: string) => {
    const reservationSignatuerPercent = Math.min(parseFloat(value), 100);

    if (!isNaN(reservationSignatuerPercent) && formInputs.price > 0) {
      setFormInputs((prev) => {
        const calculatedReservationPercent = prev.reservationPercent >= reservationSignatuerPercent ? reservationSignatuerPercent : prev.reservationPercent;
        const calculatedSignaturePercent = reservationSignatuerPercent - calculatedReservationPercent;
        const calculatedReservation = prev.price * (calculatedReservationPercent / 100);
        const calculatedSignature = prev.price * (calculatedSignaturePercent / 100);
        const calculateAtDeliveryPercent = 100 - reservationSignatuerPercent - prev.duringConstructionPercent;
        const calculatedAtDelivery = prev.price * (calculateAtDeliveryPercent / 100);

        return {
          ...prev,
          reservationSignatuerPercent: reservationSignatuerPercent,
          reservationPercent: calculatedReservationPercent,
          signaturePercent: calculatedSignaturePercent,
          reservation: calculatedReservation,
          signature: calculatedSignature,
          atDeliveryPercent: calculateAtDeliveryPercent,
          atDelivery: calculatedAtDelivery,
        };
      });
    };
  }

  return (
    <div>
      <CustomInput 
        label="Cliente"
        id="client"
        placeholder="Nombre del cliente"
        value={formInputs.client}
        onChange={(e) => setFormInputs({ ...formInputs, client: e.target.value })}
      />
      <div 
        className="grid gap-2 md:grid-cols-[2fr_1fr]"
      >
        <CustomInput
          label="Proyecto"
          id="project"
          placeholder="Nombre del proyecto"
          value={formInputs.project}
          onChange={(e) => setFormInputs({ ...formInputs, project: e.target.value })}
        />
        <CustomInput
          label="Unidad"
          id="unit"
          placeholder="Unidad"
          value={formInputs.unit}
          onChange={(e) => setFormInputs({ ...formInputs, unit: e.target.value })}
        />
      </div>
      <DatePicker 
        label="Fecha de entrega" 
        value={formInputs.deliveryDate}
        onChange={(date) => {
          if (date instanceof Date) {
            setFormInputs({ ...formInputs, deliveryDate: date });
          }
        }}
      />

      <Separator className="my-7" />

      <div className="grid gap-2 grid-cols-[1fr_2fr] mb-4">
        <div className="space-y-2 col-span-1">
          <Label htmlFor="moneda">Moneda</Label>
          <Select defaultValue="USD" onValueChange={(value) => setFormInputs({ ...formInputs, currency: value })}>
            <SelectTrigger id="moneda" className="w-full">
              <SelectValue placeholder="Moneda" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="DOP">DOP</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <CustomNumberInput 
          label="Precio" 
          id="price" 
          value={formInputs.price.toFixed(2)} 
          onChange={(value) => onPriceChange(value)}
          allowDecimals={true}
          decimalPlaces={2}
        />
      </div>

      <div className="grid gap-2 grid-cols-[1fr_1fr]">
        <DatePicker 
          label="Fecha reserva"
          value={formInputs.reservationDate}
          onChange={(date) => {
            if (date instanceof Date) {
              setFormInputs({ ...formInputs, reservationDate: date });
            }
          }}
        />
        <DatePicker 
          label="Fecha firma"
          value={formInputs.signatureDate}
          onChange={(date) => {
            if (date instanceof Date) {
              setFormInputs({ ...formInputs, signatureDate: date });
            }
          }}
        />
      </div>

      <div className="md:grid gap-2 md:grid-cols-[2fr_1fr] mb-4">
        <div className="mb-2 grid gap-2 grid-cols-[1fr_1fr]">
          <CustomNumberInput 
            label="Reserva" 
            id="reservation" 
            value={formInputs.reservation.toFixed(2)}
            onChange={(value) => onReservationChange(value)}
            allowDecimals={true}
            decimalPlaces={2}
          />
          <CustomNumberInput 
            label="Firma" 
            id="signature" 
            value={formInputs.signature.toFixed(2)} 
            onChange={(value) => onSignatureChange(value)}
            allowDecimals={true}
            decimalPlaces={2}
            />
        </div>
        <CustomNumberInput 
            label="% reserva y firma" 
            id="reservation-signature-percentage" 
            value={formInputs.reservationSignatuerPercent.toFixed(2)} 
            onChange={(value) => onReservationSignaturePercentChange(value)}
            allowDecimals={true}
            decimalPlaces={2}
            />
      </div>

      <div className="grid gap-2 grid-cols-[1fr_1fr]">
        <DatePicker 
          label="Primera cuota"
          value={formInputs.firstPaymentDate}
          onChange={(date) => {
            if (date instanceof Date) {
              setFormInputs({ ...formInputs, firstPaymentDate: date });
            }
          }}
        />
        <DatePicker 
          label="Última cuota"
          value={formInputs.lastPaymentDate}
          onChange={(date) => {
            if (date instanceof Date) {
              setFormInputs({ ...formInputs, lastPaymentDate: date });
            }
          }}
        />
      </div>

      <div className="mb-2 grid gap-2 grid-cols-[2fr_1fr]">
          <CustomNumberInput 
            label="En cuotas" 
            id="during-construction" 
            value={formInputs.duringConstruction.toFixed(2)}
            onChange={(value) => onDuringConstructionChange(value)}
            allowDecimals={true}
            decimalPlaces={2}
          />
          <CustomNumberInput 
            label="% en cuotas" 
            id="during-construction-percentage" 
            value={formInputs.duringConstructionPercent.toFixed(2)} 
            onChange={(value) => onDuringConstructionPercentChange(value)}
            allowDecimals={true}
            decimalPlaces={2}
          />
        </div>

        <div className="mb-4">
          <Label className="block mb-2">Frecuencia de los pagos</Label>
          <Select defaultValue="trimestral" onValueChange={(value) => setFormInputs({ ...formInputs, frequency: value })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar frecuencia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mensual">Mensual</SelectItem>
              <SelectItem value="bimestral">Bimestral</SelectItem>
              <SelectItem value="trimestral">Trimestral</SelectItem>
              <SelectItem value="cuatrimestral">Cuatrimestral</SelectItem>
              <SelectItem value="semestral">Semestral</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-2 grid gap-2 grid-cols-[2fr_1fr]">
          <CustomNumberInput 
            label="Contra entrega" 
            id="at-delivery" 
            value={formInputs.atDelivery.toFixed(2)}
            allowDecimals={true}
            decimalPlaces={2}
          />
          <CustomNumberInput 
            label="% contra entrega" 
            id="during-construction-percentage" 
            value={formInputs.atDeliveryPercent.toFixed(2)} 
            allowDecimals={true}
            decimalPlaces={2}
          />
        </div>
    </div>
  )
};

export default PaymentBuilderInputs;
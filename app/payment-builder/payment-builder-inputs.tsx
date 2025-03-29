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
    reservationSignatuerPercent: 10,
    deliveryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)), // Two years from now
    reservationDate: new Date(),
    signatureDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), // One month from now
  });

  console.log(formInputs);

  return (
    <div>
      <CustomInput label="Cliente" id="client" placeholder="Nombre del cliente"/>
      <div 
        className="grid gap-2 md:grid-cols-[2fr_1fr]"
      >
        <CustomInput label="Proyecto" id="project" placeholder="Nombre del proyecto"/>
        <CustomInput label="Unidad" id="unit" placeholder="Unidad"/>
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

      <Separator className="my-4" />

      <div className="grid gap-2 grid-cols-[1fr_2fr]">
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
          onChange={(value) => setFormInputs({ ...formInputs, price: parseFloat(value) || 0 })}
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

      <div className="mb-2">
        <div className="mb-2 grid gap-2 grid-cols-[1fr_1fr]">
          <CustomNumberInput 
            label="Reserva" 
            id="reservation" 
            value={formInputs.price.toFixed(2)}
            onChange={(value) => setFormInputs({ ...formInputs, reservation: parseFloat(value) || 0 })}
            allowDecimals={true}
            decimalPlaces={2}
          />
          <CustomNumberInput 
            label="Firma" 
            id="signature" 
            value={formInputs.signature.toFixed(2)} 
            onChange={(value) => setFormInputs({ ...formInputs, signature: parseFloat(value) || 0 })}
            allowDecimals={true}
            decimalPlaces={2}
          />
        </div>
        <CustomNumberInput 
            label="% reserva y firma" 
            id="reservation-signature-percentage" 
            value={formInputs.reservationSignatuerPercent.toFixed(2)} 
            onChange={(value) => setFormInputs({ ...formInputs, reservationSignatuerPercent: parseFloat(value) || 0 })}
            allowDecimals={true}
            decimalPlaces={2}
          />
      </div>   
    </div>
  )
};

export default PaymentBuilderInputs;
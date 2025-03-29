'use client';
import {useState} from "react";
import CustomInput from "@/components/custom-input";
import DatePicker from "@/components/date-picker";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PaymentBuilderInputs = () => {
  const [formInputs, setFormInputs] = useState({
    client: "",
    project: "",
    unit: "",
    deliveryDate: new Date(),
    currency: "USD",
  });

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
      <div>
        <div className="space-y-2 col-span-1">
          <Label htmlFor="moneda">Moneda</Label>
          <Select defaultValue="USD" onValueChange={(value) => setFormInputs({ ...formInputs, currency: value })}>
            <SelectTrigger id="moneda" className="w-24">
              <SelectValue placeholder="Moneda" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="DOP">DOP</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
    </div>
  )
};

export default PaymentBuilderInputs;
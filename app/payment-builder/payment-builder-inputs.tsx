'use client';
import {useState} from "react";
import CustomInput from "@/components/custom-input";
import DatePicker from "@/components/date-picker";

const PaymentBuilderInputs = () => {
  const [formInputs, setFormInputs] = useState({
    client: "",
    project: "",
    unit: "",
    deliveryDate: new Date(),
  });

  return (
    <div>
      <CustomInput label="Cliente" id="client" placeholder="Nombre del cliente"/>
      <div>
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
    </div>
  )
};

export default PaymentBuilderInputs;
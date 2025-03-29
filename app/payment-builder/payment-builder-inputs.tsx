import CustomInput from "@/components/custom-input";

const paymentBuilderInputs = () => {
  return (
    <div>
      <CustomInput label="Cliente" id="client" placeholder="Nombre del cliente"/>
      <div>
        <CustomInput label="Proyecto" id="project" placeholder="Nombre del proyecto"/>
        <CustomInput label="Unidad" id="unit" placeholder="Unidad"/>
      </div>
    </div>
  )
};

export default paymentBuilderInputs;
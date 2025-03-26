import { PlusOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, Select, Upload } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import type { Frecuencia } from "~/utils/db/models/Gasto";
dayjs.extend(customParseFormat);

type FieldType = {
  finRecurrencia: string;
  frecuencia: Frecuencia;
};
export function GastoRecurrente() {
  return (
    <>
      <Form.Item<FieldType>
        label="Fecha final del pago"
        name="finRecurrencia"
        initialValue={dayjs("01/01/2066")}
        rules={[{ required: true, message: "Fecha final del pago recurrente" }]}
      >
        <DatePicker defaultValue={dayjs("01/01/2066")} />
      </Form.Item>
      <Form.Item<FieldType>
        label="Frecuencia"
        name="frecuencia"
        initialValue={"mensual"}
        rules={[
          { required: true, message: "Frecuencia con la que haces el gasto" },
        ]}
      >
        <Select
          defaultValue={"mensual"}
          style={{ width: 200 }}
          options={[
            { label: "Diario", value: "diario" },
            { label: "Semanal", value: "semanal" },
            { label: "Mensual", value: "mensual" },
            { label: "Bimenstral", value: "bimestral" },
            { label: "Trimestral", value: "trimestral" },
            { label: "Semestral", value: "semestral" },
            { label: "Anual", value: "anual" },
          ]}
        />
      </Form.Item>
    </>
  );
}

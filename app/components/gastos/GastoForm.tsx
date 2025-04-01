import { PlusOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, Select, Upload } from "antd";
import { type Gasto } from "~/utils/db/models";
import { usePaymentTypes } from "~/utils/hooks/usePaymentType";
import { addGasto } from "~/utils/services/gastosService";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Recurrencia } from "~/utils/db/models/Gasto";
import { useState } from "react";
import { GastoRecurrente } from "./GastoRecurrente";
import { GastoMsi } from "./GastoMsi";
import { useCategorias } from "~/utils/hooks/useCategorias";
import { useSentimientos } from "~/utils/hooks/useSentimientos";
dayjs.extend(customParseFormat);
const dateFormat = "YYYY/MM/DD";

type FieldType = {
  nombre?: string;
  precio?: string;
  sentimientoId: number;
  paymentTypeId: number;
  imagen: string;
  fecha: string;
  recurrencia: Recurrencia;
  categoriaId: number;
};
const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

interface Props {
  loadGastos: () => void;
}
export function GastoForm({ loadGastos }: Props) {
  /*   const [form] = Form.useForm(); */
  const [recurrency, setRecurrency] = useState<string>("unico");
  const { paymentTypesSelect, loading } = usePaymentTypes();
  const { categoriasSelect, loading: loadingCategorias } = useCategorias();
  const { sentimientosSelect, loading: loadingSentimientos } =
    useSentimientos();

  function displayRecurrencia() {
    if (recurrency === Recurrencia.MSI) {
      return <GastoMsi></GastoMsi>;
    } else if (recurrency === Recurrencia.Recurrente) {
      return <GastoRecurrente></GastoRecurrente>;
    }
    return null;
  }

  const submitGasto = async (gasto: Gasto) => {
    const gastoReal = { ...gasto };
    gastoReal.paymentTypeId =
      gastoReal.paymentTypeId === undefined ? 1 : gastoReal.paymentTypeId;
    gastoReal.sentimientoId =
      gastoReal.sentimientoId === undefined ? 4 : gastoReal.sentimientoId;
    gastoReal.fecha = (gastoReal.fecha as any).$d.toString();
    gastoReal.precio = Number(gastoReal.precio);
    if (gastoReal.finRecurrencia) {
      gastoReal.finRecurrencia = (
        gastoReal.finRecurrencia as any
      ).$d.toString();
    }
    if (gastoReal.recurrencia === Recurrencia.MSI && gastoReal.numMeses) {
      gastoReal.finRecurrencia = dayjs(gastoReal.fecha)
        .add(gastoReal.numMeses, "month")
        .toString();
    }
    await addGasto(gastoReal);
    loadGastos();
  };

  return (
    <div className="flex flex-col gap-5 border-black rounded border-2 p-2 mb-2">
      <h1 className="font-bold">Agregar gasto:</h1>

      <Form
        name="basic"
        onFinish={submitGasto}
        className="flex gap-2 flex-wrap"
      >
        <Form.Item<FieldType>
          label="Tipo de gasto"
          name="recurrencia"
          initialValue={"unico"}
        >
          <Select
            defaultValue={"unico"}
            style={{ width: 200 }}
            onChange={(el) => {
              setRecurrency(el);
            }}
            options={[
              { label: "Unico", value: "unico" },
              { label: "Meses sin intereses", value: "msi" },
              { label: "Recurrente", value: "recurrente" },
            ]}
          />
        </Form.Item>
        <Form.Item<FieldType>
          label="Gasto"
          name="nombre"
          rules={[{ required: true, message: "En que gastaste" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Precio"
          name="precio"
          rules={[{ required: true, message: "Cuanto gastaste" }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item<FieldType>
          label="Fecha de gasto"
          name="fecha"
          initialValue={dayjs()}
        >
          <DatePicker defaultValue={dayjs()} />
        </Form.Item>
        {displayRecurrencia()}
        <Form.Item<FieldType>
          label="Categoria:"
          name="categoriaId"
          initialValue={10}
        >
          <Select
            defaultValue={10}
            style={{ width: 200 }}
            options={categoriasSelect}
          />
        </Form.Item>
        <Form.Item<FieldType>
          label="Sentimiento"
          name="sentimientoId"
          initialValue={4}
        >
          <Select
            defaultValue={4}
            style={{ width: 200 }}
            options={sentimientosSelect}
          />
        </Form.Item>
        <Form.Item<FieldType>
          label="Pagado con"
          name="paymentTypeId"
          initialValue={1}
        >
          <Select
            defaultValue={1}
            style={{ width: 300 }}
            loading={loading}
            options={paymentTypesSelect}
          />
        </Form.Item>
        <Form.Item<FieldType>
          label="Upload"
          name="imagen"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload listType="picture-card">
            <button
              style={{
                color: "inherit",
                cursor: "inherit",
                border: 0,
                background: "none",
              }}
              type="button"
            >
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </button>
          </Upload>
        </Form.Item>
        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

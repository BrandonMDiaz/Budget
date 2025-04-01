import { Button, DatePicker, Form, Input } from "antd";
import dayjs from "dayjs";
import type { Ingresos } from "~/utils/db/models/Ingresos";
import { addIngreso } from "~/utils/services/IngresoService";

export function IngresosForm() {
  function submitIngreso(ingreso: Ingresos) {
    const newIngreso = { ...ingreso };
    newIngreso.fechaFin = (ingreso.fechaFin as any).$d.toString();
    newIngreso.fechaInicio = (ingreso.fechaInicio as any).$d.toString();

    addIngreso(newIngreso);
  }
  return (
    <div className="flex flex-col gap-5 border-black rounded border-2 p-2 mb-2.5">
      <h1 className="font-bold">Agregar ingreso:</h1>

      <Form
        name="ingreso"
        onFinish={submitIngreso}
        className="flex gap-2 flex-wrap"
      >
        <Form.Item
          label="Ingreso"
          name="nombre"
          rules={[
            {
              required: true,
              message: "Escribe el nombre de tu ingreso (salario)",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Cantidad" name="cantidad">
          <Input type="number" />
        </Form.Item>
        <Form.Item
          label="Fecha del pago (desde cuando recibes este pago)"
          name="fechaInicio"
          initialValue={dayjs()}
        >
          <DatePicker defaultValue={dayjs()}></DatePicker>
        </Form.Item>
        <Form.Item
          label="Fecha final (recurrencia del pago)"
          name="fechaFin"
          initialValue={dayjs()}
        >
          <DatePicker defaultValue={dayjs()}></DatePicker>
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

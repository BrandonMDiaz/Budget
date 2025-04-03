import { Button, DatePicker, Form, Input } from "antd";
import { addCategoriaPresupuesto } from "~/utils/services/categoriaPresupuesto";

export function CategoriaPresupuestoForm() {
  return (
    <div className="flex flex-col gap-5 border-black rounded border-2 p-2 mb-2.5">
      <h1 className="font-bold">Agregar categoria:</h1>

      <Form
        name="categoria"
        onFinish={addCategoriaPresupuesto}
        className="flex gap-2 flex-wrap"
      >
        <Form.Item
          label="Nombre de la categoria"
          name="nombre"
          rules={[
            {
              required: true,
              message: "Escribe el nombre",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Porcentaje de gasto mensual asignado"
          name="porcentaje"
        >
          <Input type="number" />
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

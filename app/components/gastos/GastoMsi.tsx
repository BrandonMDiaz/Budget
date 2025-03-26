import { Form, Input } from "antd";
type FieldType = {
  numMeses: number;
};
export function GastoMsi() {
  return (
    <>
      <Form.Item<FieldType>
        label="Numero de meses"
        name="numMeses"
        rules={[{ required: true, message: "Numero de meses sin intereses" }]}
      >
        <Input type="number" />
      </Form.Item>
    </>
  );
}

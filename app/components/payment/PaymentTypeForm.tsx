import { Button, Form, Input } from "antd";
import { addPaymentType } from "~/utils/services/paymentTypeService";

interface Props {
  loadPayment: () => void;
}
export function PaymentTypeForm({ loadPayment }: Props) {
  function submitPaymentType(payment: PaymentType) {
    addPaymentType(payment);
    loadPayment();
  }
  return (
    <div className="flex flex-col gap-5 border-black rounded border-2 p-2 mb-2.5">
      <h1 className="font-bold">Agregar tipo de pago:</h1>

      <Form
        name="basic"
        onFinish={submitPaymentType}
        className="flex gap-2 flex-wrap"
      >
        <Form.Item
          label="Tarjeta"
          name="nombre"
          rules={[{ required: true, message: "En que gastaste" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Dia del corte" name="diaDeCorte">
          <Input type="number" />
        </Form.Item>
        <Form.Item
          label="Dias para pagar tarjeta"
          name="diasParaPagar"
          initialValue={20}
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

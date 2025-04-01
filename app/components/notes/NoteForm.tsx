import { Button, DatePicker, Form, Input } from "antd";
import dayjs from "dayjs";
import type { Ingresos } from "~/utils/db/models/Ingresos";
import type { Note } from "~/utils/db/models/Note";
import { addNote } from "~/utils/services/NoteService";
interface Props {
  loadPayment: () => void;
}
export function NotaForm({ loadPayment }: Props) {
  function submitNota(ingreso: Note) {
    addNote(ingreso);
  }
  return (
    <div className="flex flex-col gap-5 border-black rounded border-2 p-2 mb-2.5">
      <h1 className="font-bold">Agrega una nota:</h1>

      <Form
        name="ingreso"
        onFinish={submitNota}
        className="flex gap-2 flex-wrap"
      >
        <Form.Item
          label="Nota"
          name="texto"
          rules={[
            {
              required: true,
              message: "Escribe el nombre de tu ingreso (salario)",
            },
          ]}
        >
          <Input />
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

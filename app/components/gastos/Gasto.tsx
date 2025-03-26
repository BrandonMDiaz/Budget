import { Table } from "antd";
import Column from "antd/es/table/Column";
import { type Gasto } from "~/utils/db/models";
import { sentimientoDefault } from "~/utils/db/models/Sentimiento";

interface Props {
  gastos: Gasto[];
}
const columns = [
  {
    title: "Gasto",
    dataIndex: "nombre",
    key: "nombre",
  },
  {
    title: "Precio",
    dataIndex: "precio",
    key: "precio",
  },
  {
    title: "Fecha",
    dataIndex: "fecha",
    key: "fecha",
  },
  {
    title: "Sentimiento",
    dataIndex: "sentimientoId",
    key: "sentimientoId",
  },
  {
    title: "Tipo de pago",
    dataIndex: "paymentTypeId",
    key: "paymentTypeId",
  },
];
export function Gasto({ gastos }: Props) {
  return (
    <div className="flex gap-2">
      <Table dataSource={gastos} columns={columns}>
        <Column
          title="Sentimiento"
          dataIndex="sentimiento"
          key="sentimiento"
          render={(sentimiento: number) => (
            <>{sentimientoDefault[sentimiento]}</>
          )}
        />
      </Table>
    </div>
  );
}

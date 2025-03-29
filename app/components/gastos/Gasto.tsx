import { Table } from "antd";
import { type Gasto } from "~/utils/db/models";
import { sentimientoDefault } from "~/utils/db/models/Sentimiento";
import type { TableProps } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/es-mx";
dayjs.locale("es-mx");
interface Props {
  gastos: Gasto[];
  paymentTypes: PaymentType[];
}

const columns = [
  {
    title: "Gasto",
    dataIndex: "nombre",
    key: "nombre",
    sorter: (a: Gasto, b: Gasto) => a.nombre.localeCompare(b.nombre),
  },
  {
    title: "Precio",
    dataIndex: "precio",
    key: "precio",
    filterSearch: true,
    render: (precio: string) => {
      return "$" + precio;
    },
    sorter: (a: Gasto, b: Gasto) => a.precio - b.precio,
  },
  {
    title: "Fecha",
    dataIndex: "fecha",
    key: "fecha",
    render: (fecha: string) => {
      return dayjs(fecha).locale("es-mx").format("D-MMMM-YYYY");
    },
    sorter: (a: Gasto, b: Gasto) =>
      dayjs(a.fecha).isBefore(dayjs(b.fecha)) ? -1 : 1,
  },
  {
    title: "Sentimiento",
    dataIndex: "sentimientoId",
    key: "sentimientoId",
    render: (sentimiento: number) => (
      <>{sentimientoDefault[sentimiento - 1]?.nombre}</>
    ),
  },
  {
    title: "Tipo de pago",
    dataIndex: "paymentTypeId",
    key: "paymentTypeId",
  },
];
export function Gasto({ gastos, paymentTypes }: Props) {
  columns[4].render = (paymentTypeId: number) => {
    return <>{paymentTypes.find((el) => el.id === paymentTypeId)?.nombre}</>;
  };
  return (
    <div className="flex gap-2">
      <Table dataSource={gastos} columns={columns}></Table>
    </div>
  );
}

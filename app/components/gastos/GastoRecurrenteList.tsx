import { useState } from "react";
import { useGastos } from "~/utils/hooks/useGastos";
import dayjs from "dayjs";
import type { Gasto } from "~/utils/db/models";
import { sentimientoDefault } from "~/utils/db/models/Sentimiento";
import { Table } from "antd";
export function GastoRecurrenteList() {
  const [month, setMonth] = useState<dayjs.Dayjs>(dayjs());

  const { gastosPorRecurrencia } = useGastos(
    month.startOf("month"),
    month.endOf("month")
  );

  function getTotal(key: "msi" | "recurrente" | "unico") {
    return gastosPorRecurrencia[key].reduce(
      (acc, gasto) => acc + Number(gasto.precio),
      0
    );
  }
  const columns = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
      editable: false,
    },

    {
      title: "Gasto",
      dataIndex: "nombre",
      key: "nombre",
      sorter: (a: Gasto, b: Gasto) => a.nombre.localeCompare(b.nombre),
      editable: true,
      dataType: "string",
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
      editable: true,
      dataType: "number",
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
      editable: true,
      dataType: "date",
    },
    {
      title: "Sentimiento",
      dataIndex: "sentimientoId",
      key: "sentimientoId",
      render: (sentimiento: number) => (
        <>{sentimientoDefault[sentimiento - 1]?.nombre}</>
      ),
      editable: true,
      dataType: "number",
    },
  ];
  return (
    <div>
      <h1>Recurrente</h1>
      <h1>Total: {getTotal("recurrente")} </h1>
      <Table
        dataSource={gastosPorRecurrencia.recurrente}
        columns={columns}
      ></Table>
      <h1>Meses sin intereses</h1>
      <h1>Total: {getTotal("msi")} </h1>
      <Table dataSource={gastosPorRecurrencia.msi} columns={columns}></Table>
      <h1>Unico</h1>
      <h1>Total: {getTotal("unico")} </h1>
      <Table dataSource={gastosPorRecurrencia.unico} columns={columns}></Table>
    </div>
  );
}

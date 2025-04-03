import { useState } from "react";
import dayjs from "dayjs";
import type { Gasto } from "~/utils/db/models";
import { sentimientoDefault } from "~/utils/db/models/Sentimiento";
import { Table } from "antd";

interface Props {
  gastosPorRecurrencia: {
    msi: Gasto[];
    recurrente: Gasto[];
    unico: Gasto[];
  };
}
export function GastoRecurrenteList({ gastosPorRecurrencia }: Props) {
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
      <h1 className="text-xl font-bold">Gasto recurrente</h1>
      <h1 className="text-lg">
        Total:<span className="font-bold"> ${getTotal("recurrente")}</span>
      </h1>
      <Table
        dataSource={gastosPorRecurrencia.recurrente}
        columns={columns}
      ></Table>
      <h1 className="text-xl font-bold">Gasto meses sin intereses</h1>
      <h1>
        <span className="font-bold">Total:</span> ${getTotal("msi")}{" "}
      </h1>
      <Table dataSource={gastosPorRecurrencia.msi} columns={columns}></Table>
      <h1 className="text-xl font-bold">Gasto único</h1>

      <h1>
        <span className="font-bold">Total:</span> ${getTotal("unico")}{" "}
      </h1>
      <Table dataSource={gastosPorRecurrencia.unico} columns={columns}></Table>
    </div>
  );
}

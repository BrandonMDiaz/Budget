import { useState } from "react";
import { useGastos } from "~/utils/hooks/useGastos";
import dayjs from "dayjs";
import { Table } from "antd";
import { useCategorias } from "~/utils/hooks/useCategorias";
import type { Gasto } from "~/utils/db/models";
import { useIngreso } from "~/utils/hooks/useIngreso";
import { IngresosList } from "../ingresos/Ingresos";

export function PresupuestoInfo() {
  const [month, setMonth] = useState<dayjs.Dayjs>(dayjs());
  const { ingresoTotal } = useIngreso();
  const { categorias } = useCategorias();
  const { gastosByCategory } = useGastos(
    month.startOf("month"),
    month.endOf("month")
  );

  function calculatePercentaje(gastos: Gasto[], porcentaje: number) {
    const limite = ingresoTotal * (porcentaje / 100);
    const totalGastos = gastos.reduce(
      (acc, current) => acc + current.precio,
      0
    );
    return `$${totalGastos} / $${limite}`;
  }
  const columns = [
    {
      title: "Gasto",
      dataIndex: "nombre",
      key: "nombre",
      editable: true,
      dataType: "string",
    },
    {
      title: "$",
      dataIndex: "precio",
      key: "precio",
      editable: true,
      dataType: "number",
    },
  ];
  return (
    <div>
      <div className="w-60">
        <IngresosList></IngresosList>
      </div>
      {Object.keys(gastosByCategory).map((key) => {
        return (
          <div key={key}>
            <h1>
              {categorias[Number(key) - 1].nombre} - %
              {categorias[Number(key) - 1].porcentaje}
            </h1>
            <h2>
              {calculatePercentaje(
                gastosByCategory[key],
                categorias[Number(key) - 1].porcentaje
              )}
            </h2>
            <Table columns={columns} dataSource={gastosByCategory[key]}></Table>
          </div>
        );
      })}
    </div>
  );
}

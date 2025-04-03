import { useState } from "react";
import { useGastos } from "~/utils/hooks/useGastos";
import dayjs from "dayjs";
import { Table } from "antd";
import { useCategorias } from "~/utils/hooks/useCategorias";
import type { Gasto } from "~/utils/db/models";
import { useIngreso } from "~/utils/hooks/useIngreso";
import { IngresosList } from "../ingresos/Ingresos";
import { useMonth } from "~/utils/context/MonthContext";
import { useCategoriasPresupuesto } from "~/utils/hooks/useCategoriaPresupusto";

export function PresupuestoInfo() {
  const { month, setMonth } = useMonth();
  const { ingresoTotal } = useIngreso();
  const { categoriasPresupuesto } = useCategoriasPresupuesto();
  const { gastosByCategoryPresupuesto, pagosTarjetas } = useGastos(
    month.startOf("month").toString(),
    month.endOf("month").toString()
  );

  function calculatePercentaje(gastos: Gasto[], porcentaje: number) {
    const porPagar = Object.keys(pagosTarjetas).reduce((acc, curr) => {
      return Number(pagosTarjetas[curr].porPagar) + acc;
    }, 0);
    const limite = (ingresoTotal - porPagar) * (porcentaje / 100);
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
      {Object.keys(gastosByCategoryPresupuesto).map((key) => {
        return (
          <div key={key}>
            <h1>
              {categoriasPresupuesto[Number(key) - 1].nombre} - %
              {categoriasPresupuesto[Number(key) - 1].porcentaje}
            </h1>
            <h2>
              {calculatePercentaje(
                gastosByCategoryPresupuesto[key],
                categoriasPresupuesto[Number(key) - 1].porcentaje
              )}
            </h2>
            <Table
              columns={columns}
              dataSource={gastosByCategoryPresupuesto[key]}
            ></Table>
          </div>
        );
      })}
    </div>
  );
}

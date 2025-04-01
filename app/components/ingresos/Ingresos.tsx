import { Table } from "antd";
import { useEffect, useState } from "react";
import { useIngreso } from "~/utils/hooks/useIngreso";

export function IngresosList() {
  const { ingresos, getIngresoTotal } = useIngreso();
  const [dataSource, setDataSource] = useState(ingresos);
  useEffect(() => {
    if (ingresos.length > 0) {
      setDataSource([
        ...ingresos,
        {
          id: 0,
          nombre: "Total",
          cantidad: getIngresoTotal(),
          fechaFin: "",
          fechaInicio: "",
        },
      ]);
    }
  }, [ingresos]);
  const columns = [
    {
      title: "Ingreso",
      dataIndex: "nombre",
      key: "nombre",
      editable: true,
      dataType: "string",
    },
    {
      title: "$",
      dataIndex: "cantidad",
      key: "cantidad",
      editable: true,
      dataType: "number",
    },
  ];
  return (
    <Table columns={columns} dataSource={dataSource} pagination={false}></Table>
  );
}

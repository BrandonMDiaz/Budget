import PieChart from "~/components/charts/PieChart";
import { IngresosForm } from "~/components/ingresos/IngresosForm";
import { PresupuestoInfo } from "~/components/Presupuesto/PresupuestoInfo";
import { useMonth } from "~/utils/context/MonthContext";
import { useGastos } from "~/utils/hooks/useGastos";

export function EstadisticasScreen() {
  const { month } = useMonth();
  const { gastosPorPaymentType } = useGastos(
    month.startOf("month").toString(),
    month.endOf("month").toString()
  );
  const chartGastos = Object.keys(gastosPorPaymentType).map((key) => {
    const total = gastosPorPaymentType[key].reduce(
      (acc, curr) => acc + curr.precio,
      0
    );
    return {
      id: "key",
      label: "key",
      value: total,
      color: "hsl(91, 70%, 50%)",
    };
  });
  return <PieChart data={chartGastos} />;
}

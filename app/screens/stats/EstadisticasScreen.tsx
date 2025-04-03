import PieChartWithCustomizedLabel from "~/components/charts/PieChart";

import { useMonth } from "~/utils/context/MonthContext";
import { useGastos } from "~/utils/hooks/useGastos";

const colors = [
  "#2596be",
  "#BA274A",
  "#2191FB",
  "#B2ECE1",
  "#C5EFCB",
  "#FCC8C2",
  "#E9E3E6",
  "#FF5733", // Rojo anaranjado
  "#33FF57", // Verde brillante
  "#3357FF", // Azul fuerte
  "#FF33A8", // Rosa vibrante
  "#FFC300", // Amarillo intenso
  "#8E44AD", // Morado elegante
  "#16A085", // Verde azulado
  "#2E86C1", // Azul cielo
  "#D35400", // Naranja quemado
  "#27AE60", // Verde bosque
  "#FF5733",
  "#33FF57",
  "#3357FF",
  "#FF33A8",
  "#FFC300",
  "#8E44AD",
  "#16A085",
  "#2E86C1",
  "#D35400",
  "#27AE60",
  "#F39C12",
  "#C0392B",
  "#2980B9",
  "#E67E22",
  "#1ABC9C",
  "#9B59B6",
  "#34495E",
  "#2ECC71",
  "#E74C3C",
  "#7D3C98",
  "#F1C40F",
  "#EC7063",
  "#5DADE2",
  "#58D68D",
  "#AF7AC5",
  "#2C3E50",
  "#DFFF00",
  "#40E0D0",
  "#FF7F50",
  "#6495ED",
  "#DC143C",
  "#008B8B",
  "#B8860B",
  "#006400",
  "#8B008B",
  "#556B2F",
  "#FF8C00",
  "#9932CC",
  "#8B0000",
  "#E9967A",
  "#8FBC8F",
  "#483D8B",
  "#4682B4",
  "#D2691E",
  "#FF1493",
  "#DAA520",
  "#ADFF2F",
  "#FF69B4",
  "#CD5C5C",
  "#FFA500",
];
export function EstadisticasScreen() {
  const { month } = useMonth();
  const {
    gastosPorPaymentType,
    gastosByCategoryPresupuesto,
    gastosByCategory,
  } = useGastos(
    month.startOf("month").toString(),
    month.endOf("month").toString()
  );
  const chartGastosTarjeta = Object.keys(gastosPorPaymentType).map(
    (key, index) => {
      const total = gastosPorPaymentType[key].reduce(
        (acc, curr) => acc + curr.precio,
        0
      );
      return {
        label: key,
        value: total,
        color: colors[index],
      };
    }
  );
  const chartByCategoriaPresupuesto = Object.keys(
    gastosByCategoryPresupuesto
  ).map((key, index) => {
    const total = gastosByCategoryPresupuesto[key].reduce(
      (acc, curr) => acc + curr.precio,
      0
    );
    return {
      label: key,
      value: total,
      color: colors[index],
    };
  });

  const chartByCategoriaGasto = Object.keys(gastosByCategory)
    .filter((key) => {
      return gastosByCategory[key].length > 0;
    })
    .map((key, index) => {
      const total = gastosByCategory[key].reduce(
        (acc, curr) => acc + curr.precio,
        0
      );
      return {
        label: key,
        value: total,
        color: colors[index],
      };
    });
  return (
    <div className="flex flex-wrap justify-around">
      <PieChartWithCustomizedLabel
        data={chartGastosTarjeta}
        title={"Gastos por tarjeta"}
      />
      <PieChartWithCustomizedLabel
        data={chartByCategoriaPresupuesto}
        title={"Sentimientos"}
      />
      <PieChartWithCustomizedLabel
        data={chartByCategoriaGasto}
        title={"Categorias"}
      />
      <PieChartWithCustomizedLabel
        data={chartByCategoriaPresupuesto}
        title={"Categorias presupuesto"}
      />
    </div>
  );
}

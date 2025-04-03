import { EstadisticasScreen } from "~/screens/stats/EstadisticasScreen";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Estadisticas" },
    { name: "Estadisticas", content: "Que nadie te engañe" },
  ];
}

export default function Estadisticas() {
  return <EstadisticasScreen />;
}

import type { Route } from "./+types/home";
import { PresupuestoScreen } from "~/screens/presupuesto/PresupuestoScreen";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Presupuesto" },
    { name: "Presupuesto", content: "No tires mas el dinero" },
  ];
}

export default function Presupuesto() {
  return <PresupuestoScreen />;
}

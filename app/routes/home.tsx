import type { Route } from "./+types/home";
import { GastosScreen } from "../screens";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Gastos" },
    { name: "Gastos", content: "No tires mas el dinero" },
  ];
}

export default function Home() {
  return <GastosScreen />;
}

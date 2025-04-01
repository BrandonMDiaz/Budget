import { useState } from "react";
import { IngresosForm } from "~/components/ingresos/IngresosForm";
import { useGastos } from "~/utils/hooks/useGastos";
import dayjs from "dayjs";
import { PresupuestoInfo } from "~/components/Presupuesto/presupuestoInfo";

export function PresupuestoScreen() {
  // obtener gastos por categoria
  // mostrar cuanto llevas gastado,
  // mostrar cuanto dinero te falta para cumplir con el porcentaje.
  return (
    <div>
      <IngresosForm></IngresosForm>
      <PresupuestoInfo></PresupuestoInfo>
    </div>
  );
}

import { useEffect, useState } from "react";
import type { Gasto } from "~/utils/db/models";
import {
  getGastos,
  getGastosByIndex,
  updateGastos,
} from "../services/gastosService";
import dayjs from "dayjs";
import { Recurrencia } from "../db/models/Gasto";

interface UseGastos {
  gastos: Gasto[];
  loading: boolean;
  loadGastos: () => void;
}

export function useGastos(startDate: string, endDate: string) {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [gastosPorPaymentType, setGastosPorPaymentType] = useState<Gasto[]>([]);
  const [gastosPorSentimiento, setGastosPorSentimiento] = useState<Gasto[]>([]);
  const [gastosPorCategoria, setGastosPorCategoria] = useState<Gasto[]>([]);
  const [gastosPorRecurrentes, setGastosPorRecurrentes] = useState<Gasto[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const loadGastos = async () => {
    const gastos = await getGastos(dayjs(startDate), dayjs(endDate));
    const gastosPaymentType = await getGastosByIndex(
      dayjs(startDate),
      dayjs(endDate),
      "paymentTypeId"
    );
    setGastos(gastos as Gasto[]);
    setGastosPorPaymentType(gastosPaymentType as Gasto[]);
    /* setGastosPorSentimiento(gastos as Gasto[]);
    setGastosPorCategoria(gastos as Gasto[]);
    setGastosPorRecurrentes(gastos as Gasto[]); */

    setLoading(false);
  };

  useEffect(() => {
    loadGastos();
  }, []);

  function modifyGastos(gastos: Gasto[]) {
    gastos.forEach(async (gasto) => {
      const newGasto = { ...gasto };
      if ((gasto as any).tipo) {
        newGasto.recurrencia = (newGasto as any).tipo;
        delete (newGasto as any)["tipo"];
      }
      if (
        newGasto.finRecurrencia &&
        typeof newGasto.finRecurrencia !== "string"
      ) {
        newGasto.finRecurrencia = (
          newGasto.finRecurrencia as any
        ).$d.toString();
      }
      if (newGasto.recurrencia === Recurrencia.MSI && newGasto.numMeses) {
        newGasto.finRecurrencia = dayjs(newGasto.fecha)
          .add(newGasto.numMeses, "month")
          .toString();
      }
      await updateGastos(newGasto);
    });
  }
  return { gastos, loading, loadGastos };
}

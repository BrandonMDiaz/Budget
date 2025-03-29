import { useEffect, useState } from "react";
import type { Gasto } from "~/utils/db/models";
import {
  getGastos,
  getGastosByIndex,
  updateGastos,
} from "../services/gastosService";
import dayjs from "dayjs";
import { Recurrencia } from "../db/models/Gasto";
import { getPaymentTypes } from "../services/paymentTypeService";

interface UseGastos {
  gastos: Gasto[];
  loading: boolean;
  loadGastos: () => void;
}

export function useGastos(startDate: dayjs.Dayjs, endDate: dayjs.Dayjs) {
  const [gastosPorPaymentType, setGastosPorPaymentType] = useState<Gasto[][]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [pagosTarjetas, setPagosTarjetas] = useState<
    Record<string, { porPagar: number; pagado: number }>
  >({});
  const weAreOnCurrentMonth = dayjs().isBefore(endDate);

  useEffect(() => {
    loadGastosByPaymentType;
    calcularPagoDeTarjetaEnMesActual();
  }, []);

  const loadGastosByPaymentType = async () => {
    const paymentTypes = (await getPaymentTypes()) as PaymentType[];
    const gastosByPaymentType: Gasto[][] = [];
    paymentTypes.forEach(async (type) => {
      const gastosPaymentType = (await getGastosByIndex(
        startDate,
        endDate,
        "paymentTypeId",
        type.id
      )) as Gasto[];
      gastosByPaymentType.push(gastosPaymentType);
    });
    setGastosPorPaymentType(gastosByPaymentType);
  };

  const calcularPagoDeTarjetaEnMesActual = async () => {
    const paymentTypes = (await getPaymentTypes()) as PaymentType[];
    const gastoByPaymentType: Record<
      string,
      { porPagar: number; pagado: number }
    > = {};
    paymentTypes.forEach(async (paymentType) => {
      if (paymentType.id > 1) {
        debugger;

        const porPagar = await getDineroPorPagar(paymentType);
        let pagado = await getDineroPagadoDelMes(paymentType);
        gastoByPaymentType[paymentType.nombre] = { porPagar, pagado };
      }
    });
    setPagosTarjetas(gastoByPaymentType);
  };

  function getFechaDeCortePasadaMasReciente(payment: PaymentType) {
    const today = dayjs();
    const fechaDeCorteDelMesActual = startDate.set(
      "date",
      Number(payment.diaDeCorte)
    );

    if (
      weAreOnCurrentMonth &&
      (fechaDeCorteDelMesActual.isBefore(today) ||
        fechaDeCorteDelMesActual.isSame(today))
    ) {
      return fechaDeCorteDelMesActual;
    }
    return getFechaDeCorteDelMesPasado(payment);
  }
  function getFechaDeCorteDelMesPasado(payment: PaymentType) {
    return startDate
      .set("date", Number(payment.diaDeCorte))
      .subtract(1, "month");
  }
  function getFechaDeCorteDelMesActual(payment: PaymentType) {
    return startDate.set("date", Number(payment.diaDeCorte));
  }
  async function getDineroPagadoDelMes(payment: PaymentType) {
    const fechaDeCorteMesPasado = getFechaDeCorteDelMesPasado(payment);
    const fechaDeCorteMesActual = getFechaDeCorteDelMesActual(payment);

    const gastosDesdeFechaDeCorteHastaFinDeMes = (await getGastosByIndex(
      fechaDeCorteMesPasado,
      fechaDeCorteMesActual,
      "paymentTypeId",
      payment.id
    )) as Gasto[];

    return gastosDesdeFechaDeCorteHastaFinDeMes.reduce((accum, curr) => {
      return accum + curr.precio;
    }, 0);
  }
  async function getDineroPorPagar(paymentType: PaymentType) {
    const fechaDeCorte = getFechaDeCortePasadaMasReciente(paymentType);
    const gastosDesdeFechaDeCorteHastaFinDeMes = (await getGastosByIndex(
      fechaDeCorte,
      endDate,
      "paymentTypeId",
      paymentType.id
    )) as Gasto[];
    return gastosDesdeFechaDeCorteHastaFinDeMes.reduce((accum, curr) => {
      return curr.precio + accum;
    }, 0);
  }

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

  function modifyMonth(gastos: Gasto[]) {
    gastos.forEach(async (gasto) => {
      const newGasto = { ...gasto };
      if (
        newGasto.recurrencia &&
        newGasto.recurrencia === Recurrencia.Unico &&
        dayjs(newGasto.fecha).month() === 1
      ) {
        newGasto.fecha = dayjs(newGasto.fecha).add(1, "month").toString();
        await updateGastos(newGasto);
      }
    });
  }
  return {
    loading,
    pagosTarjetas,
    gastosPorPaymentType,
    loadGastosByPaymentType,
  };
}

import { useEffect, useState } from "react";
import type { Gasto } from "~/utils/db/models";
import {
  getGastos,
  getGastosByIndex,
  updateGastos,
} from "../services/gastosService";
import dayjs from "dayjs";
import { getPaymentTypes } from "../services/paymentTypeService";
import { Frecuencia, Recurrencia } from "../db/models/Gasto";

export function useGastos(startDate: dayjs.Dayjs, endDate: dayjs.Dayjs) {
  const [gastosPorPaymentType, setGastosPorPaymentType] = useState<
    Record<string, Gasto[]>
  >({});
  const [loadingPagosTarjetas, setLoadingPagosTarjetas] =
    useState<boolean>(false);
  const [loadingTarjetasMesActual, setLoadingTarjetasMesActual] =
    useState<boolean>(false);
  const [pagosTarjetas, setPagosTarjetas] = useState<
    Record<string, { porPagar: string; pagado: string }>
  >({});

  const [gastosPorRecurrencia, setGastosPorRecurrencia] = useState<{
    msi: Gasto[];
    recurrente: Gasto[];
    unico: Gasto[];
  }>({ msi: [], recurrente: [], unico: [] });

  const weAreOnCurrentMonth = dayjs().isBefore(endDate);

  useEffect(() => {
    loadGastosByPaymentType();
    calcularPagoDeTarjetaEnMesActual();
    getGastosPorRecurrencia();
  }, []);

  async function loadGastosByPaymentType() {
    setLoadingPagosTarjetas(true);
    const paymentTypes = (await getPaymentTypes()) as PaymentType[];

    const gastosByPaymentType: Record<string, Gasto[]> = {};
    await Promise.all(
      paymentTypes.map(async (type) => {
        const gastosPaymentType = (await getGastosByIndex(
          startDate,
          endDate,
          "paymentTypeId",
          type.id
        )) as Gasto[];
        gastosByPaymentType[type.nombre] = gastosPaymentType;
        return;
      })
    );
    setGastosPorPaymentType(gastosByPaymentType);
    setLoadingPagosTarjetas(false);
    return;
  }

  async function getGastosPorRecurrencia() {
    const msi = (await getGastosByIndex(
      startDate,
      endDate,
      "recurrencia",
      Recurrencia.MSI
    )) as Gasto[];
    const recurrente = (await getGastosByIndex(
      startDate,
      endDate,
      "recurrencia",
      Recurrencia.Recurrente
    )) as Gasto[];
    const unico = (await getGastosByIndex(
      startDate,
      endDate,
      "recurrencia",
      Recurrencia.Unico
    )) as Gasto[];

    setGastosPorRecurrencia({ msi, recurrente, unico });
  }

  async function calcularPagoDeTarjetaEnMesActual() {
    setLoadingTarjetasMesActual(true);
    const paymentTypes = (await getPaymentTypes()) as PaymentType[];

    const gastoByPaymentType: Record<
      string,
      { porPagar: string; pagado: string }
    > = {};

    await Promise.all(
      paymentTypes.map(async (paymentType) => {
        if (paymentType.id > 1) {
          const [porPagar, pagado] = await Promise.all([
            getDineroPorPagar(paymentType),
            getDineroPagadoDelMes(paymentType),
          ]);
          gastoByPaymentType[paymentType.nombre] = { porPagar, pagado };
        }
      })
    );

    setPagosTarjetas(gastoByPaymentType);
    setLoadingTarjetasMesActual(false);
    return;
  }

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

    return gastosDesdeFechaDeCorteHastaFinDeMes
      .reduce((accum, curr) => {
        return accum + Number(curr.precio);
      }, 0)
      .toFixed(2);
  }
  async function getDineroPorPagar(paymentType: PaymentType) {
    const fechaDeCorte = getFechaDeCortePasadaMasReciente(paymentType);
    const gastosDesdeFechaDeCorteHastaFinDeMes = (await getGastosByIndex(
      fechaDeCorte,
      endDate,
      "paymentTypeId",
      paymentType.id
    )) as Gasto[];
    return gastosDesdeFechaDeCorteHastaFinDeMes
      .reduce((accum, curr) => {
        return Number(curr.precio) + accum;
      }, 0)
      .toFixed(2);
  }
  async function modifyGastos() {
    const gastos = await getGastos(startDate, endDate);
    gastos.forEach(async (gasto) => {
      const newGasto = { ...gasto };
      if (typeof gasto.precio === "string") {
        newGasto.precio = Number(gasto.precio);
      }
      if (typeof gasto.fecha !== "string") {
        newGasto.fecha = (newGasto.fecha as any).$d.toString();
      }
      await updateGastos(newGasto);
    });
  }
  return {
    loadingPagosTarjetas,
    pagosTarjetas,
    gastosPorPaymentType,
    loadingTarjetasMesActual,
    gastosPorRecurrencia,
    loadGastosByPaymentType,
    calcularPagoDeTarjetaEnMesActual,
  };
}

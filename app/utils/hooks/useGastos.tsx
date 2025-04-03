import { useEffect, useState } from "react";
import type { Gasto } from "~/utils/db/models";
import {
  getGastos,
  getGastosByIndex,
  updateGastos,
} from "../services/gastosService";
import dayjs from "dayjs";
import { getPaymentTypes } from "../services/paymentTypeService";
import { Recurrencia } from "../db/models/Gasto";
import { getCategorias } from "../services/categoriasService";
import type { CategoriasGasto } from "../db/models/Categorias";
import { getCategoriasPresupuesto } from "../services/categoriaPresupuesto";
import type { CategoriasPresupuesto } from "../db/models/CategoriaPresupuesto";

export type GastoBy = Record<string, Gasto[]>;
export type Tarjetas = Record<
  string,
  {
    porPagar: string;
    pagado: string;
    fechaCorte?: string;
    diaDePago?: number;
  }
>;
export function useGastos(stDate: string, enDate: string) {
  const startDate = dayjs(stDate);
  const endDate = dayjs(enDate);
  const [gastosPorPaymentType, setGastosPorPaymentType] = useState<GastoBy>({});
  const [gastosByCategoryPresupuesto, setGastosByCategoryPresupuesto] =
    useState<GastoBy>({});
  const [total, setTotal] = useState<number>(0);
  const [loadingPagosTarjetas, setLoadingPagosTarjetas] =
    useState<boolean>(false);
  const [loadingTarjetasMesActual, setLoadingTarjetasMesActual] =
    useState<boolean>(false);
  const [pagosTarjetas, setPagosTarjetas] = useState<Tarjetas>({});

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
    getGastoPorCategoriaPresupuesto();
  }, [stDate, enDate]);

  useEffect(() => {
    getTotal();
  }, [gastosPorPaymentType, pagosTarjetas]);

  async function getGastoPorCategoriaPresupuesto() {
    const categoriasPrespuesto =
      (await getCategoriasPresupuesto()) as CategoriasPresupuesto[];
    const gastoByCategoria: GastoBy = {};
    await Promise.all(
      categoriasPrespuesto.map(async (category) => {
        const categoryGasto = (await getGastosByIndex(
          startDate,
          endDate,
          "categoriaPresupuestoId",
          category.id
        )) as Gasto[];
        gastoByCategoria[category.id] = categoryGasto;
      })
    );
    setGastosByCategoryPresupuesto(gastoByCategoria);
  }

  async function loadGastosByPaymentType() {
    setLoadingPagosTarjetas(true);
    const paymentTypes = (await getPaymentTypes()) as PaymentType[];

    const gastosByPaymentType: GastoBy = {};
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

    const gastoByPaymentType: Tarjetas = {};

    await Promise.all(
      paymentTypes.map(async (paymentType) => {
        if (paymentType.id > 1) {
          const [porPagar, pagado] = await Promise.all([
            getDineroPorPagar(paymentType),
            getDineroPagadoDelMes(paymentType),
          ]);
          gastoByPaymentType[paymentType.nombre] = {
            porPagar,
            pagado,
            fechaCorte: paymentType.diaDeCorte?.toString(),
            diaDePago: paymentType.diasParaPagar,
          };
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
  function getTotal() {
    let total = 0;
    if (
      gastosPorPaymentType["Efectivo"] !== undefined &&
      pagosTarjetas !== undefined
    ) {
      total = gastosPorPaymentType["Efectivo"].reduce(
        (acc, curr) => acc + curr.precio,
        0
      );
      Object.keys(pagosTarjetas).forEach((key) => {
        total += Number(pagosTarjetas[key].porPagar);
      });
    }

    setTotal(total);
  }
  async function modifyGasto() {
    const gastos = await getGastos(dayjs().subtract(3, "month"), dayjs());
    Promise.all(
      gastos.map(async (gasto) => {
        const newGasto = { ...gasto };
        newGasto.categoriaPresupuestoId = 1;
        await updateGastos(newGasto);
      })
    );
  }
  return {
    loadingPagosTarjetas,
    pagosTarjetas,
    gastosPorPaymentType,
    loadingTarjetasMesActual,
    gastosPorRecurrencia,
    gastosByCategoryPresupuesto,
    loadGastosByPaymentType,
    calcularPagoDeTarjetaEnMesActual,
    total,
  };
}

import { useEffect, useState } from "react";
import { getPaymentTypes } from "../services/paymentTypeService";
import type { CategoriasGasto } from "../db/models/Categorias";
import { getCategorias } from "../services/categoriasService";
import type { Ingresos } from "../db/models/Ingresos";
import { getIngresos } from "../services/IngresoService";

export function useIngreso() {
  const [ingresos, setIngresos] = useState<Ingresos[]>([]);
  const [ingresoTotal, setIngresoTotal] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);

  const loadIngreso = async () => {
    setLoading(true);
    const ingresos = (await getIngresos()) as Ingresos[];
    setIngresos(ingresos);
    setLoading(false);
  };
  const calculateIngresoTotal = () => {
    const total = ingresos.reduce(
      (acc, curr) => acc + Number(curr.cantidad),
      0
    );
    setIngresoTotal(total);
  };

  function getIngresoTotal() {
    return ingresos.reduce((acc, curr) => acc + Number(curr.cantidad), 0);
  }

  useEffect(() => {
    loadIngreso();
  }, []);
  useEffect(() => {
    calculateIngresoTotal();
  }, [ingresos]);
  return { ingresos, loading, ingresoTotal, getIngresoTotal };
}

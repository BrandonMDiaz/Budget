import { useEffect, useState } from "react";
import { getPaymentTypes } from "../services/paymentTypeService";
import type { CategoriasGasto } from "../db/models/Categorias";
import { getCategorias } from "../services/categoriasService";
import { type CategoriasPresupuesto } from "../db/models/CategoriaPresupuesto";
import { getCategoriasPresupuesto } from "../services/categoriaPresupuesto";

interface UseCategoriasPresupuesto {
  categoriasPresupuesto: CategoriasPresupuesto[];
  loading: boolean;
  categoriasPresupuestoSelect: { label: string; value: number }[];
  loadCategorias: () => void;
}
export function useCategoriasPresupuesto(): UseCategoriasPresupuesto {
  const [categoriasPresupuesto, setCategorias] = useState<
    CategoriasPresupuesto[]
  >([]);
  const [categoriasPresupuestoSelect, setCategoriasSelect] = useState<
    { label: string; value: number }[]
  >([]);

  const [loading, setLoading] = useState<boolean>(false);

  const loadCategorias = async () => {
    setLoading(true);
    const categorias =
      (await getCategoriasPresupuesto()) as CategoriasPresupuesto[];
    setCategorias(categorias);
    setCategoriasSelect(mapToSelect(categorias));
    setLoading(false);
  };

  useEffect(() => {
    loadCategorias();
  }, []);

  const mapToSelect = (categorias: CategoriasGasto[]) => {
    return categorias.map((categoria) => ({
      label: categoria.nombre,
      value: categoria.id,
    }));
  };

  return {
    categoriasPresupuesto,
    loading,
    categoriasPresupuestoSelect,
    loadCategorias,
  };
}

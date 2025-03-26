import { useEffect, useState } from "react";
import { getPaymentTypes } from "../services/paymentTypeService";
import type { CategoriasGasto } from "../db/models/Categorias";
import { getCategorias } from "../services/categoriasService";

interface UsePaymentType {
  categorias: CategoriasGasto[];
  loading: boolean;
  categoriasSelect: { label: string; value: number }[];
  loadCategorias: () => void;
}
export function useCategorias(): UsePaymentType {
  const [categorias, setCategorias] = useState<CategoriasGasto[]>([]);
  const [categoriasSelect, setCategoriasSelect] = useState<
    { label: string; value: number }[]
  >([]);

  const [loading, setLoading] = useState<boolean>(false);

  const loadCategorias = async () => {
    setLoading(true);
    const categorias = (await getCategorias()) as CategoriasGasto[];
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

  return { categorias, loading, categoriasSelect, loadCategorias };
}

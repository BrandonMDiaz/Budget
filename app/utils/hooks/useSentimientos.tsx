import { useEffect, useState } from "react";
import type { Sentimiento } from "../db/models";
import { getSentimientos } from "../services/sentimientosService";

interface UsePaymentType {
  sentimientos: Sentimiento[];
  loading: boolean;
  sentimientosSelect: { label: string; value: number }[];
  loadSentimientos: () => void;
}
export function useSentimientos(): UsePaymentType {
  const [sentimientos, setSentimientos] = useState<Sentimiento[]>([]);
  const [sentimientosSelect, setSentimientosSelect] = useState<
    { label: string; value: number }[]
  >([]);

  const [loading, setLoading] = useState<boolean>(false);

  const loadSentimientos = async () => {
    setLoading(true);
    const sentimientos = (await getSentimientos()) as Sentimiento[];
    setSentimientos(sentimientos);
    setSentimientosSelect(mapToSelect(sentimientos));
    setLoading(false);
  };

  useEffect(() => {
    loadSentimientos();
  }, []);

  const mapToSelect = (sentimientos: Sentimiento[]) => {
    return sentimientos.map((sentimiento) => ({
      label: sentimiento.nombre,
      value: sentimiento.id,
    }));
  };

  return { sentimientos, loading, sentimientosSelect, loadSentimientos };
}

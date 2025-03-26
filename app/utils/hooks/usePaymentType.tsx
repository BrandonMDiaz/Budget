import { useEffect, useState } from "react";
import { getPaymentTypes } from "../services/paymentTypeService";

interface UsePaymentType {
  paymentTypes: PaymentType[];
  loading: boolean;
  paymentTypesSelect: { label: string; value: number }[];
  loadPaymentTypes: () => void;
}
export function usePaymentTypes(): UsePaymentType {
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);
  const [paymentTypesSelect, setPaymentTypesSelect] = useState<
    { label: string; value: number }[]
  >([]);

  const [loading, setLoading] = useState<boolean>(false);

  const loadPaymentTypes = async () => {
    setLoading(true);
    const paymentTypes = (await getPaymentTypes()) as PaymentType[];
    setPaymentTypes(paymentTypes);
    setPaymentTypesSelect(mapToSelect(paymentTypes));
    setLoading(false);
  };

  useEffect(() => {
    loadPaymentTypes();
  }, []);

  const mapToSelect = (payments: PaymentType[]) => {
    return payments.map((pay) => ({
      label: pay.nombre,
      value: pay.id,
    }));
  };

  return { paymentTypes, loading, paymentTypesSelect, loadPaymentTypes };
}

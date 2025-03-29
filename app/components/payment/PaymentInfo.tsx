import { useState } from "react";
import { useGastos } from "~/utils/hooks/useGastos";
import dayjs from "dayjs";

export function PaymentInfo() {
  const [month, setMonth] = useState<dayjs.Dayjs>(dayjs());

  const { pagosTarjetas, loadGastosByPaymentType } = useGastos(
    month.startOf("month"),
    month.endOf("month")
  );
  const keys = Object.keys(pagosTarjetas);
  return (
    <div>
      <span>Tarjetas:</span>
      <span>
        {keys.map((key) => {
          const data = pagosTarjetas[key];
          return (
            <div>
              <h4>{key}:</h4>
              <p>pagado:{data.pagado}</p>
              <p>por pagar:{data.porPagar}</p>
            </div>
          );
        })}
      </span>
    </div>
  );
}

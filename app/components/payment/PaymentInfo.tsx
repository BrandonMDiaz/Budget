import { useEffect, useState } from "react";
import { useGastos } from "~/utils/hooks/useGastos";
import dayjs from "dayjs";

export function PaymentInfo() {
  const [month, setMonth] = useState<dayjs.Dayjs>(dayjs());

  const { pagosTarjetas, calcularPagoDeTarjetaEnMesActual } = useGastos(
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
            <div key={key}>
              <h4>{key}:</h4>
              <ul>
                <li>pagado:{data.pagado}</li>
                <li>por pagar:{data.porPagar}</li>
              </ul>
            </div>
          );
        })}
      </span>
    </div>
  );
}

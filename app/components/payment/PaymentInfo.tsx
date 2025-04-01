import { useEffect, useState } from "react";
import { useGastos } from "~/utils/hooks/useGastos";
import dayjs from "dayjs";

export function PaymentInfo() {
  const [month, setMonth] = useState<dayjs.Dayjs>(dayjs());

  const { pagosTarjetas, calcularPagoDeTarjetaEnMesActual } = useGastos(
    month.startOf("month"),
    month.endOf("month")
  );
  function totalPorPagar() {
    let total = 0;
    Object.keys(pagosTarjetas).forEach((key) => {
      total += Number(pagosTarjetas[key].porPagar);
    });
    return total;
  }
  const keys = Object.keys(pagosTarjetas);
  return (
    <div>
      <h1 className="text-3xl">{totalPorPagar()}</h1>
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

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import type { Tarjetas } from "~/utils/hooks/useGastos";
interface Props {
  pagosTarjetas: Tarjetas;
}
export function PaymentInfo({ pagosTarjetas }: Props) {
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
      {keys.map((key) => {
        const data = pagosTarjetas[key];
        return (
          <div key={key}>
            <h4 className="font-bold">{key}</h4>
            <ul className="ps-4">
              <li>
                por pagar: $<span className="font-bold">{data.porPagar}</span>
              </li>
              <li>
                dia de corte:
                <span className="font-bold">{data.fechaCorte}</span>
              </li>
            </ul>
          </div>
        );
      })}
      <div>
        <h4 className="font-bold">
          Por pagar total - $
          <span className="font-bold">{totalPorPagar()}</span>
        </h4>
      </div>
    </div>
  );
}

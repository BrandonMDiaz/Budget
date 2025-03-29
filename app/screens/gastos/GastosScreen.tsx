import { GastoForm } from "~/components/gastos/GastoForm";
import { useGastos } from "~/utils/hooks/useGastos";
import { PaymentTypeForm } from "~/components/payment/PaymentTypeForm";
import { Button } from "antd";
import { usePaymentTypes } from "~/utils/hooks/usePaymentType";
import { useState } from "react";
import dayjs from "dayjs";
import { Gasto } from "~/components/gastos/Gasto";
import { PaymentInfo } from "~/components/payment/PaymentInfo";

export default function GastosScreen() {
  const [month, setMonth] = useState<dayjs.Dayjs>(dayjs());
  const {
    gastosPorPaymentType,
    pagosTarjetas,
    loading: loadingGastos,
    loadGastosByPaymentType,
  } = useGastos(month.startOf("month"), month.endOf("month"));
  const {
    paymentTypes,
    loading: loadingPaymentTypes,
    loadPaymentTypes,
  } = usePaymentTypes();

  const getTotal = () => {
    let gastoTotal = 0;
    gastosPorPaymentType.forEach((el) => {
      const res = el.reduce((acc, gasto) => {
        return acc + Number(gasto.precio);
      }, 0);
      gastoTotal += res;
    });
    return gastoTotal;
  };
  return (
    <div>
      <div>
        <PaymentTypeForm loadPayment={loadPaymentTypes}></PaymentTypeForm>
        <PaymentInfo></PaymentInfo>
      </div>
      <GastoForm loadGastos={loadGastosByPaymentType}></GastoForm>
      <div className="flex flex-col gap-5 border-black rounded border-2 p-2">
        <div className="flex justify-between items-end px-10">
          <h1 className="font-bold">Gastos </h1>

          <div className="flex gap-2">
            <Button>Anterior</Button>
            <h1 className="text-2xl">
              Mes de {dayjs().locale("es-mx").format("MMMM")}
            </h1>
            <Button>Siguiente</Button>
          </div>

          <h3>Total: {getTotal()}</h3>
        </div>
        <div className="flex justify-between">
          <div>
            {/* <Gasto gastos={gastos} paymentTypes={paymentTypes} /> */}
          </div>
          <div className="p-2">
            <div>
              <h1>Tipos de pago:</h1>
              {paymentTypes.map((payment) => {
                return <p key={payment.id}>{payment.nombre}</p>;
              })}
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

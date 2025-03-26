import { GastoForm } from "~/components/gastos/GastoForm";
import { useGastos } from "~/utils/hooks/useGastos";
import { PaymentTypeForm } from "~/components/payment/PaymentTypeForm";
import { Button } from "antd";
import { usePaymentTypes } from "~/utils/hooks/usePaymentType";
import { useState } from "react";
import dayjs from "dayjs";
import { Gasto } from "~/components/gastos/Gasto";

export function GastosScreen() {
  const [month, setMonth] = useState<dayjs.Dayjs>(dayjs());
  const {
    gastos,
    loading: loadingGastos,
    loadGastos,
  } = useGastos(
    month.startOf("month").format("YYYY-MM-DD").toString(),
    month.endOf("month").format("YYYY-MM-DD").toString()
  );
  const {
    paymentTypes,
    loading: loadingPaymentTypes,
    loadPaymentTypes,
  } = usePaymentTypes();
  const getCurrentMonth = () => {
    const month = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const d = new Date();
    return month[d.getMonth()];
  };

  const getTotal = () => {
    return gastos.reduce((acc, gasto) => {
      return acc + Number(gasto.precio);
    }, 0);
  };
  return (
    <div>
      <div>
        <PaymentTypeForm loadPayment={loadPaymentTypes}></PaymentTypeForm>
      </div>
      <GastoForm loadGastos={loadGastos}></GastoForm>
      <div className="flex flex-col gap-5 border-black rounded border-2 p-2">
        <div className="flex justify-between items-end px-10">
          <h1 className="font-bold">Gastos </h1>

          <div className="flex gap-2">
            <Button>Anterior</Button>
            <h1 className="text-2xl">Mes de {getCurrentMonth()}</h1>
            <Button>Siguiente</Button>
          </div>

          <h3>Total: {getTotal()}</h3>
        </div>
        <div className="flex justify-between">
          <Gasto gastos={gastos} />
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

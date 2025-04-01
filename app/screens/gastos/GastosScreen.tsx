import { GastoForm } from "~/components/gastos/GastoForm";
import { useGastos } from "~/utils/hooks/useGastos";
import { PaymentTypeForm } from "~/components/payment/PaymentTypeForm";
import { Button } from "antd";
import { usePaymentTypes } from "~/utils/hooks/usePaymentType";
import { useState } from "react";
import dayjs from "dayjs";
import { GastoList } from "~/components/gastos/Gasto";
import { PaymentInfo } from "~/components/payment/PaymentInfo";
import { GastoRecurrenteList } from "~/components/gastos/GastoRecurrenteList";

export default function GastosScreen() {
  const [month, setMonth] = useState<dayjs.Dayjs>(dayjs());
  const [showAddType, setShowType] = useState<Boolean>(false);
  const [showAddGasto, setShowAddGasto] = useState<Boolean>(false);
  const {
    gastosPorPaymentType,
    loadingPagosTarjetas,
    loadGastosByPaymentType,
  } = useGastos(month.startOf("month"), month.endOf("month"));
  const {
    paymentTypes,
    loading: loadingPaymentTypes,
    loadPaymentTypes,
  } = usePaymentTypes();

  function minusMonth() {
    setMonth(dayjs().subtract(1, "month"));
  }
  const getTotal = () => {
    let gastoTotal = 0;
    Object.keys(gastosPorPaymentType).forEach((key) => {
      const res = gastosPorPaymentType[key].reduce((acc, gasto) => {
        return acc + Number(gasto.precio);
      }, 0);
      gastoTotal += res;
    });
    return gastoTotal;
  };
  return (
    <div>
      <div>
        <Button onClick={() => setShowType(!showAddType)}>Add Type</Button>
        {showAddType && (
          <PaymentTypeForm loadPayment={loadPaymentTypes}></PaymentTypeForm>
        )}
      </div>
      <div>
        <Button onClick={() => setShowAddGasto(!showAddGasto)}>
          Add Gasto
        </Button>
        {showAddGasto && (
          <GastoForm loadGastos={loadGastosByPaymentType}></GastoForm>
        )}
      </div>

      <div className="flex flex-col gap-5 border-black rounded border-2 p-2">
        <div className="flex justify-between items-end px-10">
          <h1 className="font-bold">Gastos </h1>

          <div className="flex gap-2">
            <Button
              onClick={() => {
                minusMonth();
              }}
            >
              Anterior
            </Button>
            <h1 className="text-2xl">
              Mes de {month.locale("es-mx").format("MMMM")}
            </h1>
            <Button>Siguiente</Button>
          </div>

          <h3>Total: {getTotal()}</h3>
        </div>
        <div className="flex justify-between">
          <div>
            <GastoList
              gastos={gastosPorPaymentType}
              paymentTypes={paymentTypes}
            />
          </div>
          <div className="flex p-2 justify-between">
            {/* <div className="">
              <h1>Tipos de pago:</h1>
              {paymentTypes.map((payment) => {
                return <p key={payment.id}>{payment.nombre}</p>;
              })}
            </div> */}
            <div className="px-3">
              <GastoRecurrenteList></GastoRecurrenteList>
              <PaymentInfo></PaymentInfo>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

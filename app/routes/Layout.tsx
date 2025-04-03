import { Button, Card } from "antd";
import { GastoForm } from "../components/gastos/GastoForm";
import { PaymentTypeForm } from "../components/payment/PaymentTypeForm";
import { useState } from "react";
import { useMonth } from "~/utils/context/MonthContext";
import { useGastos } from "~/utils/hooks/useGastos";
import { usePaymentTypes } from "~/utils/hooks/usePaymentType";
import { Outlet } from "react-router";
import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";
import { NavLink } from "react-router";
import { IngresosForm } from "~/components/ingresos/IngresosForm";
import "./layout.css";
import { PaymentInfo } from "~/components/payment/PaymentInfo";
import { IngresosList } from "~/components/ingresos/Ingresos";
import dayjs from "dayjs";

export default function Layout() {
  const { month, setMonth } = useMonth();
  const { loadGastosByPaymentType, pagosTarjetas, total } = useGastos(
    month.startOf("month").toString(),
    month.endOf("month").toString()
  );
  const { loadPaymentTypes } = usePaymentTypes();
  const [showAddType, setShowType] = useState<Boolean>(false);
  const [showAddGasto, setShowAddGasto] = useState<Boolean>(false);
  const [showAddIngreso, setShowAddIngreso] = useState<Boolean>(false);

  function pastMonth() {
    setMonth(month.subtract(1, "month"));
  }
  function nextMonth() {
    setMonth(month.add(1, "month"));
  }
  return (
    <div className="p-10 bg-gray-100">
      <nav className="flex w-full justify-end gap-4">
        <NavLink
          className=" text-blue-600 hover:text-blue-800 "
          to="/presupuesto"
          end
        >
          Presupuesto
        </NavLink>
        <NavLink className=" text-blue-600 hover:text-blue-800 " to="/" end>
          Gastos
        </NavLink>
        <NavLink
          className=" text-blue-600 hover:text-blue-800 "
          to="/estadisticas"
          end
        >
          Estadisticas
        </NavLink>
      </nav>
      <div className="mb-5 flex flex-col gap-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex flex-col gap-3 ">
            <div>
              <Button onClick={() => setShowType(!showAddType)}>
                Agregar tarjetas
              </Button>
            </div>
            {showAddType && (
              <PaymentTypeForm loadPayment={loadPaymentTypes}></PaymentTypeForm>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <div>
              <Button onClick={() => setShowAddGasto(!showAddGasto)}>
                Agregar Gasto
              </Button>
            </div>

            {showAddGasto && (
              <GastoForm loadGastos={loadGastosByPaymentType}></GastoForm>
            )}
          </div>
          <div>
            <div>
              <Button onClick={() => setShowAddIngreso(!showAddIngreso)}>
                Agregar Ingreso
              </Button>
            </div>
            {showAddIngreso && <IngresosForm></IngresosForm>}
          </div>
        </div>
        <div className="flex gap-4">
          <Card title="Tarjetas">
            <PaymentInfo pagosTarjetas={pagosTarjetas}></PaymentInfo>
          </Card>
          <IngresosList></IngresosList>
        </div>
        <div className="flex justify-between items-end ">
          <div className="flex gap-2">
            <CaretLeftOutlined className="text-2xl" onClick={pastMonth} />
            <h1 className="text-2xl">
              Mes de {month.locale("es-mx").format("MMMM")}
            </h1>
            <CaretRightOutlined className="text-2xl" onClick={nextMonth} />
          </div>

          <h3>
            Total gastos:{" "}
            <span className="font-bold">
              ${parseFloat(total.toString()).toFixed(2)}
            </span>
          </h3>
        </div>
      </div>

      <Outlet />
    </div>
  );
}

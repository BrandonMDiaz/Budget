import { useGastos } from "~/utils/hooks/useGastos";
import { Tabs, type TabsProps } from "antd";
import { usePaymentTypes } from "~/utils/hooks/usePaymentType";
import { GastoList } from "~/components/gastos/GastoList";
import { GastoRecurrenteList } from "~/components/gastos/GastoRecurrenteList";
import { useMonth } from "~/utils/context/MonthContext";

export default function GastosScreen() {
  const { month, setMonth } = useMonth();
  const { gastosPorPaymentType, gastosPorRecurrencia } = useGastos(
    month.startOf("month").toString(),
    month.endOf("month").toString()
  );
  const { paymentTypes } = usePaymentTypes();

  const tabs: TabsProps["items"] = [
    {
      key: "1",
      label: "Gastos por tipos de pago",
      children: (
        <GastoList gastos={gastosPorPaymentType} paymentTypes={paymentTypes} />
      ),
    },
    {
      key: "2",
      label: "Gastos por recurrencia",
      children: (
        <GastoRecurrenteList
          gastosPorRecurrencia={gastosPorRecurrencia}
        ></GastoRecurrenteList>
      ),
    },
  ];
  return (
    <div className="flex flex-col gap-5 border-black rounded border-2 p-2">
      <div className="flex justify-between">
        <Tabs defaultActiveKey="1" items={tabs} />
      </div>
    </div>
  );
}

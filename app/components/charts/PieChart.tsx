import * as React from "react";
import {
  type DefaultizedPieValueType,
  type PieItemIdentifier,
} from "@mui/x-charts/models";
import { PieChart } from "@mui/x-charts/PieChart";

interface PieData {
  data: { label: string; value: number; color: string }[];
  title: string;
}

const sizing = {
  margin: { right: 5 },
  width: 200,
  height: 200,
  legend: { hidden: true },
};

export default function PieChartWithCustomizedLabel({ data, title }: PieData) {
  const [identifier, setIdentifier] = React.useState<null | PieItemIdentifier>(
    null
  );
  const [id, setId] = React.useState<undefined | string | number>(undefined);
  const TOTAL = data.map((item) => item.value).reduce((a, b) => a + b, 0);

  const getArcLabel = (params: DefaultizedPieValueType) => {
    const percent = params.value / TOTAL;

    return `${(percent * 100).toFixed(0)}%`;
  };
  console.log(data);
  const size = {
    margin: data.length > 9 ? 300 : 200,
    width: data.length > 9 ? 700 : 500,
  };
  const handleClick = (
    event: React.MouseEvent<SVGPathElement, MouseEvent>,
    itemIdentifier: PieItemIdentifier,
    item: DefaultizedPieValueType
  ) => {
    setId(item.id);
    setIdentifier(itemIdentifier);
  };
  return (
    <div className="flex flex-col justify-center">
      <h1 className="text-center font-bold text-xl">{title}</h1>

      <PieChart
        series={[
          {
            innerRadius: 30,
            cornerRadius: 5,
            outerRadius: "90%",
            data,

            highlightScope: { fade: "global", highlight: "item" },
            faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
            arcLabel: getArcLabel,
          },
        ]}
        onItemClick={handleClick}
        width={size.width}
        height={300}
        margin={{ right: size.margin }}
      />
    </div>
  );
}

"use client";

import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";

Chart.register(CategoryScale);

type ChartTitles = {
  x?: string | undefined;
  y?: string | undefined;
  yRight?: string | undefined;
};

export default function ChartBarStacked({
  chartTitles,
  chartData,
}: {
  chartTitles: ChartTitles;
  chartData: any;
}) {
  return (
    <Bar
      data={chartData}
      width={10}
      height={5}
      options={{
        scales: {
          x: {
            stacked: true,
            title: {
              display: chartTitles.x != undefined,
              text: chartTitles.x,
            },
          },
          y: {
            stacked: true,
            title: {
              display: chartTitles.y != undefined,
              text: chartTitles.y,
            },
          },
          yRight: {
            display: chartTitles.yRight != undefined,
            position: "right",
            grid: {
              drawOnChartArea: false,
            },
            title: {
              display: chartTitles.yRight != undefined,
              text: chartTitles.yRight,
            },
          },
        },
      }}
    />
  );
}

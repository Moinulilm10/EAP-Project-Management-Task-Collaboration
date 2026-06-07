"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function ProgressLineChart() {
  const chartRef = useRef<ChartJS<"line">>(null);
  const [chartData, setChartData] = useState<any>({
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7"],
    datasets: [
      {
        label: "Actual Progress",
        data: [12, 19, 35, 42, 58, 70, 85],
        borderColor: "#3525cd",
        backgroundColor: "rgba(53, 37, 205, 0.1)",
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#3525cd",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Target",
        data: [15, 30, 45, 60, 75, 90, 100],
        borderColor: "#c7c4d8",
        borderWidth: 2,
        borderDash: [5, 5],
        tension: 0.4,
        fill: false,
        pointRadius: 0,
      },
    ],
  });

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const ctx = chart.ctx;
    const gradientBlue = ctx.createLinearGradient(0, 0, 0, 400);
    gradientBlue.addColorStop(0, "rgba(53, 37, 205, 0.2)");
    gradientBlue.addColorStop(1, "rgba(53, 37, 205, 0)");

    setChartData((prev: any) => ({
      ...prev,
      datasets: prev.datasets.map((dataset: any, index: number) =>
        index === 0 ? { ...dataset, backgroundColor: gradientBlue } : dataset
      ),
    }));
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top" as const,
        align: "end" as const,
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          font: { family: "'Inter', sans-serif", size: 12, weight: "bold" as const },
          color: "#505f76",
        },
      },
      tooltip: {
        backgroundColor: "rgba(25, 28, 30, 0.9)",
        titleFont: { family: "'Inter', sans-serif", size: 12, weight: "bold" as const },
        bodyFont: { family: "'Inter', sans-serif", size: 14 },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function (value: any) {
            return value + "%";
          },
          font: { family: "'Inter', sans-serif" },
          color: "#505f76",
        },
        border: { display: false },
        grid: { color: "rgba(199, 196, 216, 0.2)" },
      },
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          font: { family: "'Inter', sans-serif" },
          color: "#505f76",
        },
      },
    },
  };

  if (!chartData) return <div className="w-full h-full"></div>;

  return <Line ref={chartRef} data={chartData} options={options} className="w-full h-full" />;
}

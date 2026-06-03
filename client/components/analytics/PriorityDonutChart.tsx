"use client";

import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip);

export function PriorityDonutChart() {
  const data = {
    labels: ["High", "Medium", "Low", "Backlog"],
    datasets: [
      {
        data: [15, 45, 30, 10],
        backgroundColor: [
          "#ba1a1a", // error
          "#f59e0b", // amber for medium
          "#005338", // tertiary
          "#e0e3e5", // surface-variant
        ],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "75%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(25, 28, 30, 0.9)",
        padding: 12,
        cornerRadius: 8,
        titleFont: { family: "'Inter', sans-serif", size: 12, weight: "bold" as const },
        bodyFont: { family: "'Inter', sans-serif", size: 14 },
        callbacks: {
          label: function (context: any) {
            return ` ${context.label}: ${context.raw}%`;
          },
        },
      },
    },
  };

  return (
    <div className="flex-1 w-full flex flex-col h-full mt-lg">
      <div className="flex-1 relative w-full flex items-center justify-center">
        <div className="relative w-[240px] h-[240px]">
          <Doughnut data={data} options={options} />
          {/* Center text for donut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="font-display-lg text-display-lg text-on-surface leading-none">312</span>
            <span className="font-label-sm text-label-sm text-secondary mt-xs">Open Tasks</span>
          </div>
        </div>
      </div>
      
      {/* Custom HTML Legend */}
      <div className="mt-xl grid grid-cols-2 gap-y-sm px-lg pb-md">
        <div className="flex items-center gap-xs">
          <div className="w-3 h-3 rounded-full bg-error"></div>
          <span className="font-label-md text-label-md text-secondary">High (15%)</span>
        </div>
        <div className="flex items-center gap-xs">
          <div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div>
          <span className="font-label-md text-label-md text-secondary">Medium (45%)</span>
        </div>
        <div className="flex items-center gap-xs">
          <div className="w-3 h-3 rounded-full bg-tertiary"></div>
          <span className="font-label-md text-label-md text-secondary">Low (30%)</span>
        </div>
        <div className="flex items-center gap-xs">
          <div className="w-3 h-3 rounded-full bg-surface-variant"></div>
          <span className="font-label-md text-label-md text-secondary">Backlog (10%)</span>
        </div>
      </div>
    </div>
  );
}

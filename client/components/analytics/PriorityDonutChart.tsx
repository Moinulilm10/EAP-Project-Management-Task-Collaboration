"use client";

import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip);

interface PriorityDonutChartProps {
  distribution?: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

export function PriorityDonutChart({ distribution }: PriorityDonutChartProps) {
  const critical = distribution?.critical || 0;
  const high = distribution?.high || 0;
  const medium = distribution?.medium || 0;
  const low = distribution?.low || 0;
  
  const total = critical + high + medium + low;
  const criticalPct = total > 0 ? Math.round((critical / total) * 100) : 0;
  const highPct = total > 0 ? Math.round((high / total) * 100) : 0;
  const mediumPct = total > 0 ? Math.round((medium / total) * 100) : 0;
  const lowPct = total > 0 ? Math.round((low / total) * 100) : 0;

  const data = {
    labels: ["Critical", "High", "Medium", "Low"],
    datasets: [
      {
        data: [critical, high, medium, low],
        backgroundColor: [
          "#ba1a1a", // critical (red)
          "#e65100", // high (orange)
          "#f59e0b", // medium (amber)
          "#005338", // low (green)
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
            const val = context.raw;
            const pct = total > 0 ? Math.round((val / total) * 100) : 0;
            return ` ${context.label}: ${val} (${pct}%)`;
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
            <span className="font-display-lg text-display-lg text-on-surface leading-none">{total}</span>
            <span className="font-label-sm text-label-sm text-secondary mt-xs">Total Tasks</span>
          </div>
        </div>
      </div>
      
      {/* Custom HTML Legend */}
      <div className="mt-xl grid grid-cols-2 gap-y-sm px-lg pb-md">
        <div className="flex items-center gap-xs">
          <div className="w-3 h-3 rounded-full bg-[#ba1a1a]"></div>
          <span className="font-label-md text-label-md text-secondary">Critical ({criticalPct}%)</span>
        </div>
        <div className="flex items-center gap-xs">
          <div className="w-3 h-3 rounded-full bg-[#e65100]"></div>
          <span className="font-label-md text-label-md text-secondary">High ({highPct}%)</span>
        </div>
        <div className="flex items-center gap-xs">
          <div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div>
          <span className="font-label-md text-label-md text-secondary">Medium ({mediumPct}%)</span>
        </div>
        <div className="flex items-center gap-xs">
          <div className="w-3 h-3 rounded-full bg-[#005338]"></div>
          <span className="font-label-md text-label-md text-secondary">Low ({lowPct}%)</span>
        </div>
      </div>
    </div>
  );
}

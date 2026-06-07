"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface MemberWorkloadItem {
  userId: string;
  userName: string;
  userInitials: string;
  taskCount: number;
}

interface ProductivityBarChartProps {
  workload?: MemberWorkloadItem[];
}

export function ProductivityBarChart({ workload }: ProductivityBarChartProps) {
  const activeWorkload = workload || [];
  const labels = activeWorkload.length > 0 ? activeWorkload.map(w => w.userName) : ["No active members"];
  const dataValues = activeWorkload.length > 0 ? activeWorkload.map(w => w.taskCount) : [0];

  const data = {
    labels,
    datasets: [
      {
        label: "Active Assigned Tasks",
        data: dataValues,
        backgroundColor: "#4f46e5",
        borderRadius: 4,
        barPercentage: 0.6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(199, 196, 216, 0.2)",
          borderDash: [2, 4],
        },
        border: { display: false },
        ticks: {
          font: { family: "'Inter', sans-serif" },
          color: "#505f76",
        },
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

  return (
    <div className="absolute inset-0 w-full h-full">
      <Bar data={data} options={options} />
    </div>
  );
}

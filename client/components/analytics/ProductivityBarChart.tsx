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

export function ProductivityBarChart() {
  const data = {
    labels: ["Engineering", "Design", "Marketing", "Sales", "HR", "Support"],
    datasets: [
      {
        label: "Tasks Completed",
        data: [145, 82, 105, 65, 40, 120],
        backgroundColor: "#4f46e5", // primary-container
        borderRadius: 4,
        barPercentage: 0.6,
      },
      {
        label: "Tasks Overdue",
        data: [12, 4, 8, 3, 1, 15],
        backgroundColor: "#ffdad6", // error-container
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
          font: { family: "'Inter', sans-serif", size: 12, weight: "600" },
          color: "#505f76",
        },
      },
      tooltip: {
        backgroundColor: "rgba(25, 28, 30, 0.9)",
        titleFont: { family: "'Inter', sans-serif", size: 12, weight: "600" },
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

  return <Bar data={data} options={options} className="w-full h-full" />;
}

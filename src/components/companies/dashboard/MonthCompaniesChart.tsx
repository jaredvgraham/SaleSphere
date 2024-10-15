import { useEffect, useRef } from "react";
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary components from Chart.js for a bar chart
Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

type Props = {
  totalCompanies: number;
};

const MonthCompaniesChart = ({ totalCompanies }: Props) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (!ctx) return;

      const chart = new Chart(ctx, {
        type: "bar", // Bar chart type
        data: {
          labels: ["Companies Created This Month"], // X-axis label
          datasets: [
            {
              label: "Total Companies",
              data: [totalCompanies], // Use the totalCompanies value
              backgroundColor: "rgba(75, 192, 192, 0.6)", // Bar color
              borderColor: "rgba(75, 192, 192, 1)", // Border color
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true, // Y-axis starts at 0
            },
          },
        },
      });

      return () => {
        chart.destroy(); // Clean up the chart on unmount
      };
    }
  }, [totalCompanies]);

  return <canvas ref={chartRef}></canvas>;
};

export default MonthCompaniesChart;

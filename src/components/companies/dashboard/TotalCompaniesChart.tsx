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

// Register necessary components from Chart.js
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

const TotalCompaniesChart = ({ totalCompanies }: Props) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (!ctx) return;

      // Create a green gradient for the bar
      const gradient = ctx.createLinearGradient(
        0,
        0,
        0,
        chartRef.current.height
      );
      gradient.addColorStop(0, "rgba(34, 139, 34, 1)"); // Darker green at the top
      gradient.addColorStop(1, "rgba(144, 238, 144, 1)"); // Lighter green at the bottom

      const chart = new Chart(ctx, {
        type: "bar", // Bar chart type
        data: {
          labels: ["Total Companies"],
          datasets: [
            {
              label: "Total Companies",
              data: [totalCompanies], // Use the totalCompanies value
              backgroundColor: gradient, // Use the gradient as background
              borderColor: "white", // Optional: border color of bars
              borderWidth: 1,
            },
          ],
        },
      });

      return () => {
        chart.destroy(); // Clean up the chart on unmount
      };
    }
  }, [totalCompanies]);

  return <canvas ref={chartRef}></canvas>;
};

export default TotalCompaniesChart;

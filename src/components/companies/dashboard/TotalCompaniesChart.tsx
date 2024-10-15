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
      const chart = new Chart(chartRef.current, {
        type: "bar", // Bar chart type
        data: {
          labels: ["Total Companies"],
          datasets: [
            {
              label: "Total Companies",
              data: [totalCompanies], // Use the totalCompanies value
              backgroundColor: "rgb(80,150,0)", // Set the bar color
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

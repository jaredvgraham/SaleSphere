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

type IndustryData = {
  name: string;
  businessCount: number;
};

type Props = {
  industryData: IndustryData[];
  showBusinesses: (industryName: string) => void;
};

const IndustryChart = ({ industryData, showBusinesses }: Props) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chart = new Chart(chartRef.current, {
        type: "bar", // Changed to "bar"
        data: {
          labels: industryData.map((ind) => ind.name), // X-axis labels
          datasets: [
            {
              label: "Root Businesses", // Label for the dataset
              data: industryData.map((ind) => ind.businessCount), // Y-axis data
              backgroundColor: "#36A2EB", // Set the bar color
              borderColor: "#1E90FF", // Optional: border color of bars
              borderWidth: 1, // Border width for the bars
            },
          ],
        },
        options: {
          indexAxis: "y",
          scales: {
            x: {
              beginAtZero: true, // X-axis starts at 0
              ticks: {
                stepSize: 1, // Ensure increments of 1 (whole numbers)
              },
              title: {
                display: true,
                text: "Industry", // X-axis title
              },
            },
          },
          onClick: (event, elements) => {
            if (elements.length > 0 && chart.data.labels) {
              const chartElement = elements[0];
              const industryName = chart.data.labels[
                chartElement.index
              ] as string;
              showBusinesses(industryName); // Trigger custom logic to show businesses based on industry name
            }
          },
        },
      });

      return () => {
        chart.destroy(); // Clean up when component is unmounted
      };
    }
  }, [industryData, showBusinesses]);

  return <canvas ref={chartRef}></canvas>;
};

export default IndustryChart;

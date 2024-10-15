import { useEffect, useRef } from "react";
import {
  Chart,
  LineController, // Use line chart
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
} from "chart.js";
import "chartjs-adapter-date-fns"; // Adapter for working with date-fns in Chart.js
import { Company } from "@/types";
import { groupCompaniesByDate } from "@/utils";

// Register necessary components for a time-based line or bar chart
Chart.register(
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  TimeScale, // Add TimeScale for X-axis
  Tooltip,
  Legend
);

type Props = {
  totalCompanies: Company[];
};

const MonthCompaniesChart = ({ totalCompanies }: Props) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Group the companies by date (day or week)
    const groupedData = groupCompaniesByDate(totalCompanies, "day");

    if (chartRef.current && groupedData.length > 0) {
      const ctx = chartRef.current.getContext("2d");
      if (!ctx) return;

      const chart = new Chart(ctx, {
        type: "line", // Line chart
        data: {
          labels: groupedData.map((data) => data.date), // X-axis labels (dates)
          datasets: [
            {
              label: "Companies Created",
              data: groupedData.map((data) => data.count), // Y-axis data (counts)
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              fill: true, // Fill under the line
              tension: 0.4, // Smooth the line
              borderWidth: 2,
              pointRadius: 3, // Size of data points
            },
          ],
        },
        options: {
          scales: {
            x: {
              type: "time", // Time-based X-axis
              time: {
                unit: "day", // Ensure each day is plotted
                displayFormats: {
                  day: "d", // Display only the day (1, 2, 3, etc.)
                },
              },
              title: {
                display: true,
                text: "Day",
              },
              ticks: {
                source: "data", // Ensure it uses the data from the dataset
                autoSkip: false, // Plot every single day
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Companies Created",
              },
            },
          },
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  return `Companies: ${tooltipItem.raw}`;
                },
              },
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

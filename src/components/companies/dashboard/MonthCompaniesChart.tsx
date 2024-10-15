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
import { Company } from "@/types";
import { groupCompaniesByWeek } from "@/utils";

// Register necessary components for the bar chart
Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

type Props = {
  totalCompanies: Company[];
};

const MonthCompaniesChart = ({ totalCompanies }: Props) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Group the companies by week for the last 4 weeks
    const groupedData = groupCompaniesByWeek(totalCompanies);

    if (chartRef.current && groupedData.length > 0) {
      const ctx = chartRef.current.getContext("2d");
      if (!ctx) return;

      // Dynamically generate labels "Week-1", "Week-2", etc.
      const weekLabels = groupedData.map((_, index) => `Week-${index + 1}`);

      const chart = new Chart(ctx, {
        type: "bar", // Bar chart
        data: {
          labels: weekLabels, // Use the "Week-1", "Week-2" labels
          datasets: [
            {
              label: "Companies Created",
              data: groupedData.map((data) => data.count), // Y-axis data (counts)
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: "Week",
              },
              ticks: {
                autoSkip: false, // Plot every week
              },
            },
            y: {
              beginAtZero: true,
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

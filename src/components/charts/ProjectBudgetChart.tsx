// components/charts/ImprovedProjectBudgetChart.tsx

'use client';

import { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { Project } from '@/redux/features/projectsSlice';
import { Card } from '@/components/ui/Card';

// Register all Chart.js components
Chart.register(...registerables);

interface ProjectBudgetChartProps {
  projects: Project[];
}

// Helper function for consistent currency formatting
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};


export function ProjectBudgetChart({ projects }: ProjectBudgetChartProps) {
  const barCanvasRef = useRef<HTMLCanvasElement>(null);
  const doughnutCanvasRef = useRef<HTMLCanvasElement>(null);
  const barChartRef = useRef<Chart | null>(null);
  const doughnutChartRef = useRef<Chart | null>(null);

  useEffect(() => {
    // Ensure canvases are available and there is project data
    if (!barCanvasRef.current || !doughnutCanvasRef.current || projects.length === 0) {
      return;
    }

    // Destroy any existing chart instances to prevent memory leaks
    if (barChartRef.current) {
      barChartRef.current.destroy();
    }
    if (doughnutChartRef.current) {
        doughnutChartRef.current.destroy();
    }

    const barCtx = barCanvasRef.current.getContext('2d');
    const doughnutCtx = doughnutCanvasRef.current.getContext('2d');

    if (!barCtx || !doughnutCtx) {
      return;
    }

    // --- Prepare Data for Charts ---

    // For Stacked Bar Chart (per project)
    const labels = projects.map(p => p.name);
    const spentData = projects.map(p => p.spent);
    const remainingData = projects.map(p => Math.max(0, p.budget - p.spent));

    // For Doughnut Chart (portfolio total)
    const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0);
    const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
    const totalRemaining = Math.max(0, totalBudget - totalSpent);


    // --- Configuration for Stacked Bar Chart ---
    const barConfig: ChartConfiguration = {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Spent',
            data: spentData,
            backgroundColor: 'rgba(239, 68, 68, 0.7)', // red-500
          },
          {
            label: 'Remaining',
            data: remainingData,
            backgroundColor: 'rgba(34, 197, 94, 0.7)', // green-500
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Budget Breakdown by Project',
            font: { size: 16, weight: 'bold' },
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`,
            },
          },
        },
        scales: {
          y: {
            stacked: true, // Key property for stacking
            beginAtZero: true,
            ticks: {
              callback: (value) => formatCurrency(value as number),
            },
          },
          x: {
            stacked: true, // Key property for stacking
          },
        },
      },
    };

    // --- Configuration for Doughnut Chart ---
    const doughnutConfig: ChartConfiguration = {
        type: 'doughnut',
        data: {
            labels: ['Total Spent', 'Total Remaining'],
            datasets: [{
                data: [totalSpent, totalRemaining],
                backgroundColor: ['rgba(239, 68, 68, 0.7)', 'rgba(34, 197, 94, 0.7)'],
                borderColor: ['rgb(239, 68, 68)', 'rgb(34, 197, 94)'],
                borderWidth: 1,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Overall Budget Status',
                    font: { size: 16, weight: 'bold' },
                },
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: (context) => `${context.label}: ${formatCurrency(context.parsed)}`,
                    }
                }
            }
        }
    }

    // Create new chart instances
    barChartRef.current = new Chart(barCtx, barConfig);
    doughnutChartRef.current = new Chart(doughnutCtx, doughnutConfig);

    // Cleanup function to run when component unmounts or projects change
    return () => {
      if (barChartRef.current) {
        barChartRef.current.destroy();
        barChartRef.current = null;
      }
      if (doughnutChartRef.current) {
        doughnutChartRef.current.destroy();
        doughnutChartRef.current = null;
      }
    };
  }, [projects]); // Re-run effect when projects data changes

  // Display a message if there are no projects to show
  if (projects.length === 0) {
    return (
      <Card title="Error Message" className="p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">No Project Data</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Add projects to see the budget overview dashboard.
        </p>
      </Card>
    );
  }

  // Render the two charts
  return (
    <Card title="Spending Breakdown" className="p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-80 relative">
            <canvas ref={doughnutCanvasRef}></canvas>
        </div>
        <div className="h-80 relative">
            <canvas ref={barCanvasRef}></canvas>
        </div>
      </div>
    </Card>
  );
}
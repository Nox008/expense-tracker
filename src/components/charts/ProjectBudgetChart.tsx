// components/charts/ProjectBudgetChart.tsx

'use client';

import { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { Project } from '@/redux/features/projectsSlice';
import { Card } from '@/components/ui/Card';

Chart.register(...registerables);

interface ProjectBudgetChartProps {
  projects: Project[];
}

export function ProjectBudgetChart({ projects }: ProjectBudgetChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current || projects.length === 0) return;

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Prepare data
    const labels = projects.map(project => project.name);
    const budgetData = projects.map(project => project.budget);
    const spentData = projects.map(project => project.spent);
    const remainingData = projects.map(project => Math.max(0, project.budget - project.spent));

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Budget',
            data: budgetData,
            backgroundColor: 'rgba(59, 130, 246, 0.5)', // blue-500 with opacity
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 1,
          },
          {
            label: 'Spent',
            data: spentData,
            backgroundColor: 'rgba(239, 68, 68, 0.5)', // red-500 with opacity
            borderColor: 'rgb(239, 68, 68)',
            borderWidth: 1,
          },
          {
            label: 'Remaining',
            data: remainingData,
            backgroundColor: 'rgba(34, 197, 94, 0.5)', // green-500 with opacity
            borderColor: 'rgb(34, 197, 94)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Project Budget Overview',
            font: {
              size: 16,
              weight: 'bold',
            },
          },
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const value = context.parsed.y;
                const formatted = new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  maximumFractionDigits: 0,
                }).format(value);
                return `${context.dataset.label}: ${formatted}`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  maximumFractionDigits: 0,
                }).format(value as number);
              },
            },
          },
          x: {
            ticks: {
              maxRotation: 45,
              minRotation: 0,
            },
          },
        },
      },
    };

    chartRef.current = new Chart(ctx, config);

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [projects]);

  if (projects.length === 0) {
    return (
      <Card className="p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">No Projects to Display</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Create some projects to see the budget overview chart.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="h-64 md:h-80">
        <canvas ref={canvasRef}></canvas>
      </div>
    </Card>
  );
}
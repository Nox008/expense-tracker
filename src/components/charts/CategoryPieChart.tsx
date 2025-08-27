// components/charts/CategoryPieChart.tsx

'use client';

import { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useTheme } from 'next-themes';
import { IExpense } from '@/lib/models';
import { Card } from '@/components/ui/Card';

// Register the necessary components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryPieChartProps {
  expenses: IExpense[];
}

export function CategoryPieChart({ expenses }: CategoryPieChartProps) {
  const { theme } = useTheme();

  const chartData = useMemo(() => {
    const categoryTotals: { [key: string]: number } = {};

    expenses.forEach(expense => {
      if (categoryTotals[expense.category]) {
        categoryTotals[expense.category] += expense.amount;
      } else {
        categoryTotals[expense.category] = expense.amount;
      }
    });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    return {
      labels,
      datasets: [
        {
          label: 'Spending by Category',
          data,
          backgroundColor: [
            '#4ade80', // green-400
            '#38bdf8', // lightBlue-400
            '#facc15', // yellow-400
            '#fb923c', // orange-400
            '#f87171', // red-400
            '#a78bfa', // violet-400
            '#c084fc', // purple-400
            '#f472b6', // pink-400
          ],
          borderColor: theme === 'dark' ? '#18181b' : '#ffffff', // zinc-900 or white
          borderWidth: 2,
        },
      ],
    };
  }, [expenses, theme]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
            color: theme === 'dark' ? '#f4f4f5' : '#18181b', // zinc-100 or zinc-900
        }
      },
    },
  };

  return (
    <Card title="Spending Breakdown">
      {expenses.length > 0 ? (
        <div className="relative h-96">
          <Pie data={chartData} options={options} />
        </div>
      ) : (
        <p className="text-center text-zinc-500 dark:text-zinc-400 py-16">
          No expense data available to display a chart.
        </p>
      )}
    </Card>
  );
}
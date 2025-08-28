// components/charts/MonthlyTrendsChart.tsx

'use client';

import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTheme } from 'next-themes';
import { IExpense, IIncome } from '@/lib/models';
import { Card } from '@/components/ui/Card';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MonthlyTrendsChartProps {
  expenses: IExpense[];
  income: IIncome[];
}

export function MonthlyTrendsChart({ expenses, income }: MonthlyTrendsChartProps) {
  const { theme } = useTheme();

  const chartData = useMemo(() => {
    // Get last 6 months of data
    const now = new Date();
    const months = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
        label: date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
        expenses: 0,
        income: 0,
      });
    }

    // Aggregate expenses by month
    expenses.forEach(expense => {
      const expenseDate = new Date(expense.date);
      const monthKey = `${expenseDate.getFullYear()}-${String(expenseDate.getMonth() + 1).padStart(2, '0')}`;
      const month = months.find(m => m.key === monthKey);
      if (month) {
        month.expenses += expense.amount;
      }
    });

    // Aggregate income by month
    income.forEach(inc => {
      const incomeDate = new Date(inc.date);
      const monthKey = `${incomeDate.getFullYear()}-${String(incomeDate.getMonth() + 1).padStart(2, '0')}`;
      const month = months.find(m => m.key === monthKey);
      if (month) {
        month.income += inc.amount;
      }
    });

    const labels = months.map(m => m.label);
    const expenseData = months.map(m => m.expenses);
    const incomeData = months.map(m => m.income);
    const netData = months.map(m => m.income - m.expenses);

    return {
      labels,
      datasets: [
        {
          label: 'Income',
          data: incomeData,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderWidth: 3,
          fill: false,
          tension: 0.4,
          pointBackgroundColor: '#10b981',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
        },
        {
          label: 'Expenses',
          data: expenseData,
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderWidth: 3,
          fill: false,
          tension: 0.4,
          pointBackgroundColor: '#ef4444',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
        },
        {
          label: 'Net Savings',
          data: netData,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
        },
      ],
    };
  }, [expenses, income]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: theme === 'dark' ? '#f4f4f5' : '#18181b',
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: '500' as const,
          },
        },
      },
      tooltip: {
        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
        titleColor: theme === 'dark' ? '#f3f4f6' : '#1f2937',
        bodyColor: theme === 'dark' ? '#f3f4f6' : '#1f2937',
        borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            const value = context.raw;
            const label = context.dataset.label;
            return `${label}: ₹${value.toLocaleString()}`;
          }
        }
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Month',
          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
          font: {
            size: 12,
            weight: '500' as const,
          },
        },
        grid: {
          color: theme === 'dark' ? '#374151' : '#e5e7eb',
          drawBorder: false,
        },
        ticks: {
          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
          font: {
            size: 11,
          },
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Amount (₹)',
          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
          font: {
            size: 12,
            weight: '500' as const,
          },
        },
        grid: {
          color: theme === 'dark' ? '#374151' : '#e5e7eb',
          drawBorder: false,
        },
        ticks: {
          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
          font: {
            size: 11,
          },
          callback: function(value: any) {
            return '₹' + value.toLocaleString();
          }
        },
      },
    },
    elements: {
      line: {
        borderJoinStyle: 'round' as const,
      },
      point: {
        hoverBorderWidth: 3,
      },
    },
  };

  return (
    <Card title="Monthly Trends">
      {(expenses.length > 0 || income.length > 0) ? (
        <div className="relative h-80">
          <Line data={chartData} options={options} />
        </div>
      ) : (
        <p className="text-center text-zinc-500 dark:text-zinc-400 py-16">
          No data available to display trends.
        </p>
      )}
    </Card>
  );
}
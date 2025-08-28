// components/charts/ExpenseVsIncomeChart.tsx

'use client';

import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useTheme } from 'next-themes';
import { IExpense, IIncome } from '@/lib/models';
import { Card } from '@/components/ui/Card';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ExpenseVsIncomeChartProps {
  expenses: IExpense[];
  income: IIncome[];
}

export function ExpenseVsIncomeChart({ expenses, income }: ExpenseVsIncomeChartProps) {
  const { theme } = useTheme();

  const { chartData, stats } = useMemo(() => {
    // Get current month and last 2 months
    const now = new Date();
    const months = [];
    
    for (let i = 2; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
        label: date.toLocaleDateString('en-IN', { month: 'short' }),
        fullLabel: date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
        expenses: 0,
        income: 0,
      });
    }

    // Aggregate data by month
    expenses.forEach(expense => {
      const expenseDate = new Date(expense.date);
      const monthKey = `${expenseDate.getFullYear()}-${String(expenseDate.getMonth() + 1).padStart(2, '0')}`;
      const month = months.find(m => m.key === monthKey);
      if (month) {
        month.expenses += expense.amount;
      }
    });

    income.forEach(inc => {
      const incomeDate = new Date(inc.date);
      const monthKey = `${incomeDate.getFullYear()}-${String(incomeDate.getMonth() + 1).padStart(2, '0')}`;
      const month = months.find(m => m.key === monthKey);
      if (month) {
        month.income += inc.amount;
      }
    });

    // Calculate totals and averages
    const totalIncome = months.reduce((sum, month) => sum + month.income, 0);
    const totalExpenses = months.reduce((sum, month) => sum + month.expenses, 0);
    const avgIncome = totalIncome / months.length;
    const avgExpenses = totalExpenses / months.length;
    
    const stats = {
      totalIncome,
      totalExpenses,
      avgIncome,
      avgExpenses,
      savingsRate: totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100) : 0,
    };

    const chartData = {
      labels: months.map(m => m.label),
      datasets: [
        {
          label: 'Income',
          data: months.map(m => m.income),
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
          borderColor: '#10b981',
          borderWidth: 2,
          borderRadius: 6,
          borderSkipped: false,
        },
        {
          label: 'Expenses',
          data: months.map(m => m.expenses),
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          borderColor: '#ef4444',
          borderWidth: 2,
          borderRadius: 6,
          borderSkipped: false,
        },
      ],
    };

    return { chartData, stats };
  }, [expenses, income]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ₹${context.raw.toLocaleString()}`;
          }
        }
      },
    },
    scales: {
      x: {
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
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <Card title="Income vs Expenses (Last 3 Months)">
      {(expenses.length > 0 || income.length > 0) ? (
        <div className="space-y-4">
          {/* Chart */}
          <div className="relative h-64">
            <Bar data={chartData} options={options} />
          </div>
          
          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t dark:border-zinc-700">
            <div className="text-center">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Avg Income</p>
              <p className="text-lg font-semibold text-green-600">{formatCurrency(stats.avgIncome)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Avg Expenses</p>
              <p className="text-lg font-semibold text-red-600">{formatCurrency(stats.avgExpenses)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Net</p>
              <p className={`text-lg font-semibold ${stats.totalIncome - stats.totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(stats.totalIncome - stats.totalExpenses)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Savings Rate</p>
              <p className={`text-lg font-semibold ${stats.savingsRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.savingsRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-zinc-500 dark:text-zinc-400 py-16">
          No data available to display comparison.
        </p>
      )}
    </Card>
  );
}
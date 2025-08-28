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

  const { chartData, totalSpent, categoryStats } = useMemo(() => {
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
    const totalSpent = data.reduce((sum, amount) => sum + amount, 0);

    // Create category stats for the legend
    const categoryStats = labels.map((label, index) => ({
      label,
      amount: data[index],
      percentage: totalSpent > 0 ? ((data[index] / totalSpent) * 100).toFixed(1) : '0',
    })).sort((a, b) => b.amount - a.amount);

    const chartData = {
      labels,
      datasets: [
        {
          label: 'Spending by Category',
          data,
          backgroundColor: [
            '#10b981', // emerald-500
            '#3b82f6', // blue-500
            '#f59e0b', // amber-500
            '#ef4444', // red-500
            '#8b5cf6', // violet-500
            '#ec4899', // pink-500
            '#06b6d4', // cyan-500
            '#84cc16', // lime-500
            '#f97316', // orange-500
            '#6366f1', // indigo-500
          ],
          borderColor: theme === 'dark' ? '#18181b' : '#ffffff',
          borderWidth: 2,
          hoverBackgroundColor: [
            '#059669', // emerald-600
            '#2563eb', // blue-600
            '#d97706', // amber-600
            '#dc2626', // red-600
            '#7c3aed', // violet-600
            '#db2777', // pink-600
            '#0891b2', // cyan-600
            '#65a30d', // lime-600
            '#ea580c', // orange-600
            '#4f46e5', // indigo-600
          ],
          hoverBorderWidth: 3,
        },
      ],
    };

    return { chartData, totalSpent, categoryStats };
  }, [expenses, theme]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // We'll create our own custom legend
      },
      tooltip: {
        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
        titleColor: theme === 'dark' ? '#f3f4f6' : '#1f2937',
        bodyColor: theme === 'dark' ? '#f3f4f6' : '#1f2937',
        borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            const percentage = totalSpent > 0 ? ((context.raw / totalSpent) * 100).toFixed(1) : '0';
            return `${context.label}: ₹${context.raw.toLocaleString()} (${percentage}%)`;
          }
        }
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
    },
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <Card title="Spending Breakdown">
      {expenses.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pie Chart */}
          <div className="lg:col-span-2">
            <div className="relative h-80">
              <Pie data={chartData} options={options} />
            </div>
          </div>
          
          {/* Custom Legend with Stats */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg mb-4">Category Breakdown</h3>
            <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
              Total Spent: {formatCurrency(totalSpent)}
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {categoryStats.map((category, index) => (
                <div key={category.label} className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: chartData.datasets[0].backgroundColor[
                          chartData.labels?.indexOf(category.label) || 0
                        ] as string
                      }}
                    />
                    <span className="font-medium text-sm">{category.label}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-sm">{formatCurrency(category.amount)}</div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">{category.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-zinc-500 dark:text-zinc-400 py-16">
          No expense data available to display a chart.
        </p>
      )}
    </Card>
  );
}
// app/(dashboard)/page.tsx

'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchExpenses } from '@/redux/features/expenseSlice';

// We will create these components in the next steps
import { DashboardSummary } from '@/components/dashboard/DashboardSummary';
import { ExpenseForm } from '@/components/dashboard/ExpenseForm';
import { RecentExpenses } from '@/components/dashboard/RecentExpenses';
import { CategoryPieChart } from '@/components/charts/CategoryPieChart';

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { expenses, status, error } = useSelector((state: RootState) => state.expenses);

  // Fetch expenses when the component mounts if they haven't been fetched yet
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchExpenses());
    }
  }, [status, dispatch]);

  let content;

  if (status === 'loading') {
    content = <p className="text-center">Loading expenses...</p>;
  } else if (status === 'succeeded') {
    content = (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Summary Cards */}
        <div className="lg:col-span-3">
          <DashboardSummary expenses={expenses} />
        </div>
        
        {/* Expense Form */}
        <div className="lg:col-span-1">
          <ExpenseForm />
        </div>

        {/* Recent Expenses List */}
        <div className="lg:col-span-2">
          <RecentExpenses expenses={expenses} />
        </div>

        {/* Pie Chart */}
        <div className="lg:col-span-3">
           <CategoryPieChart expenses={expenses} />
        </div>
      </div>
    );
  } else if (status === 'failed') {
    content = <p className="text-center text-red-500">Error: {error}</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      {content}
    </div>
  );
}
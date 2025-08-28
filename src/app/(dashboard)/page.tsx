// app/(dashboard)/page.tsx

'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchExpenses } from '@/redux/features/expenseSlice';
import { fetchIncome } from '@/redux/features/incomeSlice';

// Components
import { DashboardSummary } from '@/components/dashboard/DashboardSummary';
import { ExpenseForm } from '@/components/dashboard/ExpenseForm';
import { IncomeForm } from '@/components/dashboard/IncomeForm';
import { RecentExpenses } from '@/components/dashboard/RecentExpenses';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { CategoryPieChart } from '@/components/charts/CategoryPieChart';
import { MonthlyTrendsChart } from '@/components/charts/MonthlyTrendsChart';
import { ExpenseVsIncomeChart } from '@/components/charts/ExpenseVsIncomeChart';

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { expenses, status: expensesStatus, error: expensesError } = useSelector((state: RootState) => state.expenses);
  const { income, status: incomeStatus, error: incomeError } = useSelector((state: RootState) => state.income);

  // Fetch expenses and income when the component mounts if they haven't been fetched yet
  useEffect(() => {
    if (expensesStatus === 'idle') {
      dispatch(fetchExpenses());
    }
    if (incomeStatus === 'idle') {
      dispatch(fetchIncome());
    }
  }, [expensesStatus, incomeStatus, dispatch]);

  let content;

  if (expensesStatus === 'loading' || incomeStatus === 'loading') {
    content = <p className="text-center">Loading expenses...</p>;
  } else if (expensesStatus === 'succeeded' && incomeStatus === 'succeeded') {
    content = (
      // MODIFIED: Changed to a 2-column grid for better alignment
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Summary Cards - Spans full width */}
        <div className="lg:col-span-2">
          <DashboardSummary expenses={expenses} income={income} />
        </div>
        
        {/* Forms Side by Side - Each takes up half the width */}
        <div className="lg:col-span-1">
          <ExpenseForm />
        </div>
        <div className="lg:col-span-1">
          <IncomeForm />
        </div>

        {/* Recent Transactions - MOVED here and spans full width */}
        <div className="lg:col-span-2">
          <RecentTransactions expenses={expenses} income={income} />
        </div>

        {/* Charts Section - Each spans full width */}
        <div className="lg:col-span-2">
          <CategoryPieChart expenses={expenses} />
        </div>
        
        <div className="lg:col-span-2">
          <MonthlyTrendsChart expenses={expenses} income={income} />
        </div>
        
        <div className="lg:col-span-2">
          <ExpenseVsIncomeChart expenses={expenses} income={income} />
        </div>
      </div>
    );
  } else if (expensesStatus === 'failed' || incomeStatus === 'failed') {
    const error = expensesError || incomeError;
    content = <p className="text-center text-red-500">Error: {error}</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      {content}
    </div>
  );
}
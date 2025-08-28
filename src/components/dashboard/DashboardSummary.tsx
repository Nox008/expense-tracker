// components/dashboard/DashboardSummary.tsx

import { IExpense, IIncome } from '@/lib/models';
import { Card } from '@/components/ui/Card';
import { DollarSign, Wallet, TrendingUp } from 'lucide-react';

interface DashboardSummaryProps {
  expenses: IExpense[];
  income: IIncome[];
}

export function DashboardSummary({ expenses, income }: DashboardSummaryProps) {
  // Calculate total income (dynamic budget)
  const totalIncome = income.reduce((sum, inc) => sum + inc.amount, 0);
  
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBalance = totalIncome - totalSpent;

  // Helper to format numbers as currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card title="Total Income">
        <p className="text-2xl font-semibold flex items-center">
            <TrendingUp className="h-6 w-6 mr-2 text-green-500"/>
            {formatCurrency(totalIncome)}
        </p>
      </Card>
      <Card title="Total Spent">
        <p className="text-2xl font-semibold flex items-center">
            <DollarSign className="h-6 w-6 mr-2 text-red-500"/>
            {formatCurrency(totalSpent)}
        </p>
      </Card>
      <Card title="Remaining Balance">
         <p className={`text-2xl font-semibold flex items-center ${remainingBalance < 0 ? 'text-red-500' : 'text-green-500'}`}>
            <Wallet className="h-6 w-6 mr-2"/>
            {formatCurrency(remainingBalance)}
        </p>
      </Card>
      <Card title="Savings Rate">
         <p className={`text-2xl font-semibold flex items-center ${remainingBalance < 0 ? 'text-red-500' : 'text-green-500'}`}>
            <TrendingUp className="h-6 w-6 mr-2"/>
            {totalIncome > 0 ? `${((remainingBalance / totalIncome) * 100).toFixed(1)}%` : '0%'}
        </p>
      </Card>
    </div>
  );
}
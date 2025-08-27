// components/dashboard/DashboardSummary.tsx

import { IExpense } from '@/lib/models';
import { Card } from '@/components/ui/Card';
import { DollarSign, Wallet } from 'lucide-react';

interface DashboardSummaryProps {
  expenses: IExpense[];
}

export function DashboardSummary({ expenses }: DashboardSummaryProps) {
  // We'll use a hardcoded budget for this example
  const budget = 2000;

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBalance = budget - totalSpent;

  // Helper to format numbers as currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card title="Budget">
        <p className="text-2xl font-semibold flex items-center">
            <Wallet className="h-6 w-6 mr-2 text-blue-500"/>
            {formatCurrency(budget)}
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
    </div>
  );
}
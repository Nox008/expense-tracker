// components/dashboard/RecentTransactions.tsx

import { IExpense, IIncome } from '@/lib/models';
import { Card } from '@/components/ui/Card';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface RecentTransactionsProps {
  expenses: IExpense[];
  income: IIncome[];
}

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: Date;
}

export function RecentTransactions({ expenses, income }: RecentTransactionsProps) {
  // Combine expenses and income into a single transactions array
  const transactions: Transaction[] = [
    ...expenses.map(expense => ({
      id: expense._id as string,
      type: 'expense' as const,
      amount: expense.amount,
      description: expense.category + (expense.note ? ` - ${expense.note}` : ''),
      date: new Date(expense.date),
    })),
    ...income.map(inc => ({
      id: inc._id as string,
      type: 'income' as const,
      amount: inc.amount,
      description: inc.source + (inc.note ? ` - ${inc.note}` : ''),
      date: new Date(inc.date),
    }))
  ];

  // Sort by date (most recent first) and take first 8
  const recent = transactions
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 8);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <Card title="Recent Transactions">
      {recent.length === 0 ? (
        <p className="text-zinc-500 dark:text-zinc-400">No recent transactions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b dark:border-zinc-700">
                <th className="py-2 font-semibold">Type</th>
                <th className="py-2 font-semibold">Description</th>
                <th className="py-2 font-semibold">Date</th>
                <th className="py-2 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((transaction) => (
                <tr key={transaction.id} className="border-b dark:border-zinc-800">
                  <td className="py-3 pr-2">
                    <div className="flex items-center">
                      {transaction.type === 'income' ? (
                        <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1 text-red-500" />
                      )}
                      <span className="capitalize text-sm">{transaction.type}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-2">{transaction.description}</td>
                  <td className="py-3 pr-2 text-sm text-zinc-500 dark:text-zinc-400">
                    {transaction.date.toLocaleDateString()}
                  </td>
                  <td className={`py-3 text-right font-medium ${
                    transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
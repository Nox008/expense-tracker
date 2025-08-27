// components/dashboard/RecentExpenses.tsx

import { IExpense } from '@/lib/models';
import { Card } from '@/components/ui/Card';

interface RecentExpensesProps {
  expenses: IExpense[];
}

export function RecentExpenses({ expenses }: RecentExpensesProps) {
  const recent = expenses.slice(0, 5);

  return (
    <Card title="Recent Transactions">
      {recent.length === 0 ? (
        <p className="text-zinc-500 dark:text-zinc-400">No recent transactions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b dark:border-zinc-700">
                <th className="py-2 font-semibold">Category</th>
                <th className="py-2 font-semibold">Date</th>
                <th className="py-2 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((expense) => (
                <tr key={expense._id as string} className="border-b dark:border-zinc-800">
                  <td className="py-3 pr-2">{expense.category}</td>
                  <td className="py-3 pr-2 text-sm text-zinc-500 dark:text-zinc-400">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 text-right font-medium">
                    -${expense.amount.toFixed(2)}
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
// components/dashboard/ExpenseForm.tsx

'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { addExpense } from '@/redux/features/expenseSlice';
import { Card } from '@/components/ui/Card';

const categories = ['Groceries', 'Transport', 'Bills', 'Entertainment', 'Health', 'Other'];

export function ExpenseForm() {
  const dispatch = useDispatch<AppDispatch>();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(parseFloat(amount))) return;

    // In a real app, projectId would come from the current project context
    const hardcodedProjectId = '60d0fe4f5311236168a109ca'; // Replace with a valid ObjectId from your DB

    dispatch(addExpense({
      amount: parseFloat(amount),
      category,
      note,
      projectId: hardcodedProjectId as any, // Using 'any' for simplicity as it's a string
    }));

    // Reset form
    setAmount('');
    setCategory(categories[0]);
    setNote('');
  };

  return (
    <Card title="Add New Expense">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium mb-1">Amount</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded-md bg-transparent dark:border-zinc-700"
            placeholder="0.00"
            required
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded-md bg-transparent dark:border-zinc-700 dark:bg-zinc-900"
            required
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="note" className="block text-sm font-medium mb-1">Note (Optional)</label>
          <input
            type="text"
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full p-2 border rounded-md bg-transparent dark:border-zinc-700"
            placeholder="e.g., Weekly groceries"
          />
        </div>
        <button type="submit" className="w-full bg-emerald-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-emerald-600 transition-colors">
          Add Expense
        </button>
      </form>
    </Card>
  );
}
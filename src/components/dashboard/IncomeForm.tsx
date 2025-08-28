// components/dashboard/IncomeForm.tsx

'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { addIncome } from '@/redux/features/incomeSlice';
import { Card } from '@/components/ui/Card';

const incomeSources = ['Salary', 'Freelance', 'Investment', 'Business', 'Gift', 'Other'];

export function IncomeForm() {
  const dispatch = useDispatch<AppDispatch>();
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState(incomeSources[0]);
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(parseFloat(amount))) return;

    dispatch(addIncome({
      amount: parseFloat(amount),
      source,
      note,
    }));

    // Reset form
    setAmount('');
    setSource(incomeSources[0]);
    setNote('');
  };

  return (
    <Card title="Add Income">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="income-amount" className="block text-sm font-medium mb-1">Amount</label>
          <input
            type="number"
            id="income-amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded-md bg-transparent dark:border-zinc-700"
            placeholder="0.00"
            required
          />
        </div>
        <div>
          <label htmlFor="income-source" className="block text-sm font-medium mb-1">Source</label>
          <select
            id="income-source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full p-2 border rounded-md bg-transparent dark:border-zinc-700 dark:bg-zinc-900"
            required
          >
            {incomeSources.map(src => <option key={src} value={src}>{src}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="income-note" className="block text-sm font-medium mb-1">Note (Optional)</label>
          <input
            type="text"
            id="income-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full p-2 border rounded-md bg-transparent dark:border-zinc-700"
            placeholder="e.g., Monthly salary"
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">
          Add Income
        </button>
      </form>
    </Card>
  );
}
// components/ui/Card.tsx

import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Card({ title, children, className }: CardProps) {
  return (
    <div className={`p-6 rounded-lg border bg-white dark:bg-zinc-900/50 dark:border-zinc-800 ${className}`}>
      <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{title}</h3>
      <div className="mt-2">{children}</div>
    </div>
  );
}
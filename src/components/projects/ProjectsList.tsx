// components/projects/ProjectsList.tsx

'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { addProjectExpense, deleteProject } from '@/redux/features/projectsSlice';
import { Project } from '@/redux/features/projectsSlice';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface ProjectsListProps {
  projects: Project[];
}

export function ProjectsList({ projects }: ProjectsListProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [expenseForm, setExpenseForm] = useState({
    amount: '',
    description: '',
    category: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getBudgetPercentage = (spent: number, budget: number) => {
    return Math.min((spent / budget) * 100, 100);
  };

  const getProgressBarColor = (percentage: number) => {
    if (percentage < 70) return 'bg-green-500';
    if (percentage < 90) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleAddExpense = async (projectId: string) => {
    if (!expenseForm.amount || !expenseForm.description) return;

    setIsSubmitting(true);
    try {
      await dispatch(addProjectExpense({
        projectId,
        amount: parseFloat(expenseForm.amount),
        description: expenseForm.description,
        category: expenseForm.category,
        date: new Date().toISOString(),
      })).unwrap();

      setExpenseForm({
        amount: '',
        description: '',
        category: '',
      });
      setExpandedProject(null);
    } catch (error) {
      console.error('Failed to add expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await dispatch(deleteProject(projectId)).unwrap();
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  const sortedProjects = [...projects].sort((a, b) => {
    // Sort by completion status (incomplete first) then by creation date
    const aComplete = a.spent >= a.budget;
    const bComplete = b.spent >= b.budget;
    
    if (aComplete !== bComplete) {
      return aComplete ? 1 : -1;
    }
    
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (projects.length === 0) {
    return (
      <Card className="p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">No Projects Yet</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Create your first project to start tracking your budget.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Your Projects</h3>
      <div className="space-y-4">
        {sortedProjects.map((project) => {
          const remaining = project.budget - project.spent;
          const percentage = getBudgetPercentage(project.spent, project.budget);
          const isOverBudget = project.spent > project.budget;
          const isExpanded = expandedProject === project.id;

          return (
            <div
              key={project.id}
              className={`border rounded-lg p-4 transition-all duration-200 ${
                isOverBudget
                  ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                  : 'border-gray-200 dark:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-lg">{project.name}</h4>
                  {project.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {project.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setExpandedProject(isExpanded ? null : project.id)}
                  >
                    {isExpanded ? 'Cancel' : 'Add Expense'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteProject(project.id)}
                    className="text-red-600 hover:text-red-700 hover:border-red-300"
                  >
                    Delete
                  </Button>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>Spent: {formatCurrency(project.spent)}</span>
                  <span>Budget: {formatCurrency(project.budget)}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(percentage)}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className={percentage >= 100 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}>
                    {percentage.toFixed(1)}% used
                  </span>
                  <span className={remaining < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}>
                    {remaining < 0 ? 'Over by ' : 'Remaining: '}{formatCurrency(Math.abs(remaining))}
                  </span>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t pt-4 mt-4 space-y-3">
                  <h5 className="font-medium">Add New Expense</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="number"
                      placeholder="Amount (₹)"
                      value={expenseForm.amount}
                      onChange={(e) => setExpenseForm(prev => ({ ...prev, amount: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                      min="0"
                      step="0.01"
                    />
                    <input
                      type="text"
                      placeholder="Category (Optional)"
                      value={expenseForm.category}
                      onChange={(e) => setExpenseForm(prev => ({ ...prev, category: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Description"
                    value={expenseForm.description}
                    onChange={(e) => setExpenseForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  />
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleAddExpense(project.id)}
                      disabled={isSubmitting || !expenseForm.amount || !expenseForm.description}
                      size="sm"
                    >
                      {isSubmitting ? 'Adding...' : 'Add Expense'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setExpandedProject(null);
                        setExpenseForm({ amount: '', description: '', category: '' });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
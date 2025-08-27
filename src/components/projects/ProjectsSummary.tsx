// components/projects/ProjectsSummary.tsx

import { Card } from '@/components/ui/Card';
import { Project } from '@/redux/features/projectsSlice';

interface ProjectsSummaryProps {
  projects: Project[];
}

export function ProjectsSummary({ projects }: ProjectsSummaryProps) {
  const totalBudget = projects.reduce((sum, project) => sum + project.budget, 0);
  const totalSpent = projects.reduce((sum, project) => sum + project.spent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const activeProjects = projects.filter(p => p.spent < p.budget).length;
  const completedProjects = projects.filter(p => p.spent >= p.budget).length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <Card className="p-6">
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Total Budget
        </div>
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          {formatCurrency(totalBudget)}
        </div>
      </Card>

      <Card className="p-6">
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Total Spent
        </div>
        <div className="text-2xl font-bold text-red-600 dark:text-red-400">
          {formatCurrency(totalSpent)}
        </div>
      </Card>

      <Card className="p-6">
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Remaining
        </div>
        <div className={`text-2xl font-bold ${
          totalRemaining >= 0 
            ? 'text-green-600 dark:text-green-400' 
            : 'text-red-600 dark:text-red-400'
        }`}>
          {formatCurrency(totalRemaining)}
        </div>
      </Card>

      <Card className="p-6">
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Active Projects
        </div>
        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
          {activeProjects}
        </div>
      </Card>

      <Card className="p-6">
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Completed
        </div>
        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
          {completedProjects}
        </div>
      </Card>
    </div>
  );
}
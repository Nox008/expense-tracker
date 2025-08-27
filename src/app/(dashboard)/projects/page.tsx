// app/(dashboard)/projects/page.tsx

'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchProjects } from '@/redux/features/projectsSlice';

import { ProjectsSummary } from '@/components/projects/ProjectsSummary';
import { ProjectForm } from '@/components/projects/ProjectForm';
import { ProjectsList } from '@/components/projects/ProjectsList';
import { ProjectBudgetChart } from '@/components/charts/ProjectBudgetChart';

export default function ProjectsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { projects, status, error } = useSelector((state: RootState) => state.projects);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProjects());
    }
  }, [status, dispatch]);

  let content;

  if (status === 'loading') {
    content = <p className="text-center">Loading projects...</p>;
  } else if (status === 'succeeded') {
    content = (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Summary Cards */}
        <div className="lg:col-span-3">
          <ProjectsSummary projects={projects} />
        </div>
        
        {/* Project Form */}
        <div className="lg:col-span-1">
          <ProjectForm />
        </div>

        {/* Projects List */}
        <div className="lg:col-span-2">
          <ProjectsList projects={projects} />
        </div>

        {/* Budget Chart */}
        {projects.length > 0 && (
          <div className="lg:col-span-3">
            <ProjectBudgetChart projects={projects} />
          </div>
        )}
      </div>
    );
  } else if (status === 'failed') {
    content = <p className="text-center text-red-500">Error: {error}</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
      {content}
    </div>
  );
}
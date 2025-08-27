// redux/features/projectsSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Project {
  id: string;
  name: string;
  budget: number;
  spent: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectExpense {
  id: string;
  projectId: string;
  amount: number;
  description: string;
  category?: string;
  date: string;
  createdAt: string;
}

interface ProjectsState {
  projects: Project[];
  projectExpenses: ProjectExpense[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProjectsState = {
  projects: [],
  projectExpenses: [],
  status: 'idle',
  error: null,
};

// Async thunks for API calls
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async () => {
    const response = await fetch('/api/projects');
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    return response.json();
  }
);

export const fetchProjectExpenses = createAsyncThunk(
  'projects/fetchProjectExpenses',
  async (projectId: string) => {
    const response = await fetch(`/api/projects/${projectId}/expenses`);
    if (!response.ok) {
      throw new Error('Failed to fetch project expenses');
    }
    return response.json();
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData: Omit<Project, 'id' | 'spent' | 'createdAt' | 'updatedAt'>) => {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });
    if (!response.ok) {
      throw new Error('Failed to create project');
    }
    return response.json();
  }
);

export const addProjectExpense = createAsyncThunk(
  'projects/addProjectExpense',
  async (expenseData: Omit<ProjectExpense, 'id' | 'createdAt'>) => {
    const response = await fetch(`/api/projects/${expenseData.projectId}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expenseData),
    });
    if (!response.ok) {
      throw new Error('Failed to add project expense');
    }
    return response.json();
  }
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, ...updates }: Partial<Project> & { id: string }) => {
    const response = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      throw new Error('Failed to update project');
    }
    return response.json();
  }
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (id: string) => {
    const response = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete project');
    }
    return id;
  }
);

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch projects
      .addCase(fetchProjects.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch projects';
      })
      
      // Create project
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create project';
      })
      
      // Add project expense
      .addCase(addProjectExpense.fulfilled, (state, action) => {
        const expense = action.payload;
        state.projectExpenses.push(expense);
        
        // Update the project's spent amount
        const project = state.projects.find(p => p.id === expense.projectId);
        if (project) {
          project.spent += expense.amount;
        }
      })
      .addCase(addProjectExpense.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to add expense';
      })
      
      // Update project
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update project';
      })
      
      // Delete project
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(p => p.id !== action.payload);
        state.projectExpenses = state.projectExpenses.filter(e => e.projectId !== action.payload);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete project';
      })
      
      // Fetch project expenses
      .addCase(fetchProjectExpenses.fulfilled, (state, action) => {
        const newExpenses = action.payload.filter(
          (newExp: ProjectExpense) => !state.projectExpenses.some(exp => exp.id === newExp.id)
        );
        state.projectExpenses.push(...newExpenses);
      });
  },
});

export const { clearError } = projectsSlice.actions;
export default projectsSlice.reducer;
// app/api/projects/route.ts

import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '@/lib/db';
import { Project, ProjectExpense } from '@/lib/models';

export async function GET() {
  try {
    await connectToDB();
    
    // Fetch all projects
    const projects = await Project.find({}).sort({ createdAt: -1 }).lean();
    
    // Calculate spent amounts for each project
    const projectsWithSpent = await Promise.all(
      projects.map(async (project) => {
        const expenses = await ProjectExpense.find({ 
          projectId: project._id 
        }).lean();
        
        const spent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        
        return {
          id: project._id.toString(),
          name: project.name,
          budget: project.budget,
          spent,
          description: project.description || '',
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
        };
      })
    );

    return NextResponse.json(projectsWithSpent);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDB();
    
    const body = await request.json();
    const { name, budget, description } = body;

    if (!name || typeof budget !== 'number') {
      return NextResponse.json(
        { error: 'Name and budget are required' },
        { status: 400 }
      );
    }

    if (budget < 0) {
      return NextResponse.json(
        { error: 'Budget must be a positive number' },
        { status: 400 }
      );
    }

    const newProject = new Project({
      name: name.trim(),
      budget,
      description: description?.trim() || '',
    });

    await newProject.save();

    const response = {
      id: newProject._id.toString(),
      name: newProject.name,
      budget: newProject.budget,
      spent: 0,
      description: newProject.description,
      createdAt: newProject.createdAt,
      updatedAt: newProject.updatedAt,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
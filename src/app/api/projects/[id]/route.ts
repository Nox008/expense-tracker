// app/api/projects/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDB from '@/lib/db';
import { Project, ProjectExpense } from '@/lib/models';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();
    
    const { id } = await params; // Await params to fix the Next.js error
    const body = await request.json();

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { 
        ...body,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    ).lean();
    
    if (!updatedProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Calculate spent amount
    const expenses = await ProjectExpense.find({ projectId: id }).lean();
    const spent = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    const response = {
      id: updatedProject._id.toString(),
      name: updatedProject.name,
      budget: updatedProject.budget,
      spent,
      description: updatedProject.description || '',
      createdAt: updatedProject.createdAt,
      updatedAt: updatedProject.updatedAt,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();
    
    const { id } = await params; // Await params to fix the Next.js error

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }

    const project = await Project.findByIdAndDelete(id);
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Remove all project expenses
    await ProjectExpense.deleteMany({ projectId: id });

    return NextResponse.json({ 
      message: 'Project deleted successfully',
      deletedId: id 
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
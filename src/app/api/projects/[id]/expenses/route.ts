// app/api/projects/[id]/expenses/route.ts

import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDB from '@/lib/db';
import { Project, ProjectExpense } from '@/lib/models';

export async function GET(
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

    const expenses = await ProjectExpense.find({ projectId: id })
      .sort({ createdAt: -1 })
      .lean();
    
    const formattedExpenses = expenses.map(expense => ({
      id: expense._id.toString(),
      projectId: expense.projectId.toString(),
      amount: expense.amount,
      description: expense.description,
      category: expense.category || '',
      date: expense.date,
      createdAt: expense.createdAt,
    }));
    
    return NextResponse.json(formattedExpenses);
  } catch (error) {
    console.error('Error fetching project expenses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project expenses' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();
    
    const body = await request.json();
    const { id } = await params; // Await params to fix the Next.js error
    
    const { amount, description, category, date } = body;

    // Validate input
    if (!amount || !description) {
      return NextResponse.json(
        { error: 'Amount and description are required' },
        { status: 400 }
      );
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be a positive number' },
        { status: 400 }
      );
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }

    // Check if project exists
    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const newExpense = new ProjectExpense({
      projectId: new mongoose.Types.ObjectId(id),
      amount: parseFloat(amount.toString()),
      description: description.trim(),
      category: category?.trim() || '',
      date: date ? new Date(date) : new Date(),
    });

    await newExpense.save();

    const response = {
      id: newExpense._id.toString(),
      projectId: newExpense.projectId.toString(),
      amount: newExpense.amount,
      description: newExpense.description,
      category: newExpense.category,
      date: newExpense.date,
      createdAt: newExpense.createdAt,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error adding project expense:', error);
    return NextResponse.json(
      { error: 'Failed to add project expense' },
      { status: 500 }
    );
  }
}
// app/api/expenses/route.ts

import { NextResponse } from 'next/server';
import connectToDB from '@/lib/db';
import { Expense } from '@/lib/models';

/**
 * @route   GET /api/expenses
 * @desc    Get all expenses
 * @access  Public
 */
export async function GET() {
  try {
    await connectToDB();

    const expenses = await Expense.find({}).sort({ date: -1 }); // Sort by most recent

    return NextResponse.json({
      success: true,
      data: expenses,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        error: 'Server error',
      },
      { status: 500 }
    );
  }
}

/**
 * @route   POST /api/expenses
 * @desc    Add a new expense
 * @access  Public
 */
export async function POST(request: Request) {
  try {
    await connectToDB();

    const body = await request.json();
    const { amount, category, note, projectId, date } = body;

    // The Mongoose schema will validate the required fields
    const newExpense = new Expense({
      amount,
      category,
      note,
      projectId,
      date,
    });

    const savedExpense = await newExpense.save();

    return NextResponse.json(
      {
        success: true,
        data: savedExpense,
      },
      { status: 201 } // 201 Created status code
    );
  } catch (error: any) {
    console.error(error);
    // Check for Mongoose validation error
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 400 } // Bad Request
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: 'Server error',
      },
      { status: 500 }
    );
  }
}
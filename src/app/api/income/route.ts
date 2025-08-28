// app/api/income/route.ts

import { NextResponse } from 'next/server';
import connectToDB from '@/lib/db';
import { Income } from '@/lib/models';

/**
 * @route   GET /api/income
 * @desc    Get all income entries
 * @access  Public
 */
export async function GET() {
  try {
    await connectToDB();

    const income = await Income.find({}).sort({ date: -1 }); // Sort by most recent

    return NextResponse.json({
      success: true,
      data: income,
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
 * @route   POST /api/income
 * @desc    Add a new income entry
 * @access  Public
 */
export async function POST(request: Request) {
  try {
    await connectToDB();

    const body = await request.json();
    const { amount, source, note, date } = body;

    // The Mongoose schema will validate the required fields
    const newIncome = new Income({
      amount,
      source,
      note,
      date,
    });

    const savedIncome = await newIncome.save();

    return NextResponse.json(
      {
        success: true,
        data: savedIncome,
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
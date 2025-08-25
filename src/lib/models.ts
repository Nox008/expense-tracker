// lib/models.ts

import mongoose, { Document, Schema, Model } from 'mongoose';

// Interface for Project document
export interface IProject extends Document {
  name: string;
  budget: number;
  startDate: Date;
  endDate?: Date;
}

// Interface for Expense document
export interface IExpense extends Document {
  amount: number;
  category: string;
  note?: string;
  date: Date;
  projectId: mongoose.Types.ObjectId;
}

// Project Schema
const ProjectSchema: Schema<IProject> = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide a project name.'],
    trim: true,
  },
  budget: {
    type: Number,
    required: [true, 'Please provide a budget.'],
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide a start date.'],
  },
  endDate: {
    type: Date,
  },
});

// Expense Schema
const ExpenseSchema: Schema<IExpense> = new Schema({
  amount: {
    type: Number,
    required: [true, 'Please provide an expense amount.'],
  },
  category: {
    type: String,
    required: [true, 'Please provide a category.'],
    trim: true,
  },
  note: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
});

// To prevent model overwrite errors in development, we check if the model already exists.
export const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
export const Expense: Model<IExpense> = mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema);
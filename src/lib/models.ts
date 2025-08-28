// lib/models.ts

import mongoose, { Document, Schema, Model } from 'mongoose';

// Interface for Project document
export interface IProject extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  budget: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for Expense document
export interface IExpense extends Document {
  _id: mongoose.Types.ObjectId;
  amount: number;
  category: string;
  note?: string;
  date: Date;
  projectId: mongoose.Types.ObjectId;
  createdAt: Date;
}

// NEW: Interface for Income document
export interface IIncome extends Document {
  _id: mongoose.Types.ObjectId;
  amount: number;
  source: string;
  note?: string;
  date: Date;
  createdAt: Date;
}

// Interface for Project Expense (separate from regular expenses)
export interface IProjectExpense extends Document {
  _id: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  amount: number;
  description: string;
  category?: string;
  date: Date;
  createdAt: Date;
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
    min: [0, 'Budget must be a positive number.'],
  },
  description: {
    type: String,
    trim: true,
  },
  
}, {
  timestamps: true, // This adds createdAt and updatedAt automatically
});

// Regular Expense Schema (your existing expenses)
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
}, {
  timestamps: true,
});

// NEW: Income Schema
const IncomeSchema: Schema<IIncome> = new Schema({
  amount: {
    type: Number,
    required: [true, 'Please provide an income amount.'],
    min: [0, 'Amount must be a positive number.'],
  },
  source: {
    type: String,
    required: [true, 'Please provide an income source.'],
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
}, {
  timestamps: true,
});

// Project Expense Schema (separate collection for project-specific expenses)
const ProjectExpenseSchema: Schema<IProjectExpense> = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Project ID is required.'],
  },
  amount: {
    type: Number,
    required: [true, 'Please provide an expense amount.'],
    min: [0, 'Amount must be a positive number.'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description.'],
    trim: true,
  },
  category: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    required: [true, 'Please provide a date.'],
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Add indexes for better performance
ProjectSchema.index({ createdAt: -1 });
ProjectExpenseSchema.index({ projectId: 1, createdAt: -1 });
ExpenseSchema.index({ projectId: 1, date: -1 });
IncomeSchema.index({ date: -1 }); // NEW: Income index

// To prevent model overwrite errors in development, we check if the model already exists.
export const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
export const Expense: Model<IExpense> = mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema);
export const Income: Model<IIncome> = mongoose.models.Income || mongoose.model<IIncome>('Income', IncomeSchema); // NEW
export const ProjectExpense: Model<IProjectExpense> = mongoose.models.ProjectExpense || mongoose.model<IProjectExpense>('ProjectExpense', ProjectExpenseSchema);
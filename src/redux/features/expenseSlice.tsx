// redux/features/expensesSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { IExpense } from '@/lib/models';

// Define a type for the slice state
interface ExpensesState {
  expenses: IExpense[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Define the initial state using that type
const initialState: ExpensesState = {
  expenses: [],
  status: 'idle',
  error: null,
};

// Type for the data returned from the GET API
interface FetchExpensesResponse {
    success: boolean;
    data: IExpense[];
}

// Type for the new expense data sent to the POST API
type NewExpenseData = Omit<IExpense, '_id' | 'date'> & { date?: string };


// Async thunk for fetching expenses
export const fetchExpenses = createAsyncThunk<FetchExpensesResponse, void, { rejectValue: string }>(
  'expenses/fetchExpenses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/expenses');
      if (!response.ok) {
        throw new Error('Failed to fetch expenses.');
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for adding a new expense
export const addExpense = createAsyncThunk<IExpense, NewExpenseData, { rejectValue: string }>(
  'expenses/addExpense',
  async (newExpense, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newExpense),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add expense.');
      }
      const data = await response.json();
      return data.data; // The API returns { success: true, data: ... }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Cases for fetchExpenses
      .addCase(fetchExpenses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchExpenses.fulfilled, (state, action: PayloadAction<FetchExpensesResponse>) => {
        state.status = 'succeeded';
        state.expenses = action.payload.data as any;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Something went wrong';
      })
      // Cases for addExpense
      .addCase(addExpense.pending, (state) => {
        // Optionally, you can set a specific status for adding
        state.status = 'loading'; 
      })
      .addCase(addExpense.fulfilled, (state, action: PayloadAction<IExpense>) => {
        state.status = 'succeeded';
        state.expenses.unshift(action.payload as any); // Add new expense to the beginning of the array
      })
      .addCase(addExpense.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to add expense';
      });
  },
});

export default expensesSlice.reducer;
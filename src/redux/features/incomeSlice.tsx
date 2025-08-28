// redux/features/incomeSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { IIncome } from '@/lib/models';

// Define a type for the slice state
interface IncomeState {
  income: IIncome[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Define the initial state using that type
const initialState: IncomeState = {
  income: [],
  status: 'idle',
  error: null,
};

// Type for the data returned from the GET API
interface FetchIncomeResponse {
    success: boolean;
    data: IIncome[];
}

// Type for the new income data sent to the POST API
type NewIncomeData = Omit<IIncome, '_id' | 'date'> & { date?: string };

// Async thunk for fetching income
export const fetchIncome = createAsyncThunk<FetchIncomeResponse, void, { rejectValue: string }>(
  'income/fetchIncome',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/income');
      if (!response.ok) {
        throw new Error('Failed to fetch income.');
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for adding a new income
export const addIncome = createAsyncThunk<IIncome, NewIncomeData, { rejectValue: string }>(
  'income/addIncome',
  async (newIncome, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/income', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newIncome),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add income.');
      }
      const data = await response.json();
      return data.data; // The API returns { success: true, data: ... }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const incomeSlice = createSlice({
  name: 'income',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Cases for fetchIncome
      .addCase(fetchIncome.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchIncome.fulfilled, (state, action: PayloadAction<FetchIncomeResponse>) => {
        state.status = 'succeeded';
        state.income = action.payload.data as any;
      })
      .addCase(fetchIncome.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Something went wrong';
      })
      // Cases for addIncome
      .addCase(addIncome.pending, (state) => {
        state.status = 'loading'; 
      })
      .addCase(addIncome.fulfilled, (state, action: PayloadAction<IIncome>) => {
        state.status = 'succeeded';
        state.income.unshift(action.payload as any); // Add new income to the beginning of the array
      })
      .addCase(addIncome.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to add income';
      });
  },
});

export default incomeSlice.reducer;
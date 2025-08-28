// redux/store.ts

import { configureStore } from '@reduxjs/toolkit';
import expensesReducer from './features/expenseSlice';
import projectsReducer from './features/projectsSlice'; // New projects slice
import incomeReducer from './features/incomeSlice'; // NEW

export const store = configureStore({
  reducer: {
    expenses: expensesReducer,
    projects: projectsReducer,
    income: incomeReducer, // NEW
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
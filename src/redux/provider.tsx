// redux/provider.tsx

"use client";

import { Provider } from "react-redux";
import { store } from "./store"; // We will create this file in a later step

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
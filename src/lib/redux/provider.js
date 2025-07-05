"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore } from "./store";

export function StoreProvider({ children }) {
  // Use a ref to persist the store instance across renders
  const storeRef = useRef(makeStore());
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }
  return <Provider store={storeRef.current}>{children}</Provider>;
}

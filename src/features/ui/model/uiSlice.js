"use client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "light", // Default theme
};

export const toggleTheme = createAsyncThunk(
  "ui/toggleTheme",
  (theme, { dispatch }) => {
    localStorage.setItem("theme", theme);
    document.documentElement.dataset["theme"] = theme;
    dispatch(setTheme(theme));
  }
);

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

export const { setTheme } = uiSlice.actions;

export const selectTheme = (state) => state.ui.theme;

export default uiSlice.reducer;

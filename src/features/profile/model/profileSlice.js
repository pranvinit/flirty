import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiSlice } from "@/lib/redux/apiSlice";

const initialState = {
  uuid: null,
  name: "",
  bio: "",
  avatar_url: "",
  hobbies: [],
  traits: [],
  profileScore: 0,
  profileFeedback: "",
  isInitializing: true,
};

export const initializeApp = createAsyncThunk(
  "profile/initializeApp",
  async (_, { getState, dispatch }) => {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate a delay for initialization
    const { profile } = getState();
    if (profile.uuid) {
      return profile.uuid;
    }

    let uuid = localStorage.getItem("uuid");

    if (!uuid) {
      const response = await fetch("/api/profile/create-uuid");
      if (!response.ok) {
        throw new Error("Failed to fetch UUID");
      }
      const data = await response.json();

      uuid = data.uuid;

      if (!uuid) {
        throw new Error("UUID not found in API response");
      }
      localStorage.setItem("uuid", uuid);
    }

    if (uuid) {
      await dispatch(apiSlice.endpoints.getProfile.initiate(uuid));
    }

    return uuid;
  }
);
export const clearProfile = createAsyncThunk(
  "profile/clearProfile",
  async () => {
    localStorage.removeItem("uuid");
    return initialState;
  }
);

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    if (typeof window === "undefined") return;
    builder
      .addCase(initializeApp.pending, (state) => {
        state.isInitializing = true;
      })
      .addCase(initializeApp.fulfilled, (state, action) => {
        state.uuid = action.payload;
        state.isInitializing = false;
      })
      .addCase(initializeApp.rejected, (state) => {
        state.isInitializing = false;
      })
      .addCase(clearProfile.fulfilled, () => initialState)
      .addMatcher(
        apiSlice.endpoints.getProfile.matchFulfilled,
        (state, action) => ({
          ...state,
          ...action.payload,
        })
      )
      .addMatcher(
        apiSlice.endpoints.updateProfile.matchFulfilled,
        (state, action) => ({
          ...state,
          ...action.payload,
        })
      )
      .addMatcher(
        apiSlice.endpoints.judgeProfile.matchFulfilled,
        (state, action) => {
          const { profileScore, feedback } = action.payload;
          state.profileScore = profileScore;
          state.profileFeedback = feedback;
        }
      )
      .addMatcher(
        apiSlice.endpoints.uploadAvatar.matchFulfilled,
        (state, action) => {
          const { avatar_url } = action.payload;
          state.avatar_url = avatar_url;
        }
      );
  },
});

export const selectProfile = (state) => state.profile;
export const selectIsInitializing = (state) => state.profile.isInitializing;

export default profileSlice.reducer;

import { createSlice, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "@/lib/redux/apiSlice";

const initialState = {
  activeFlirt: {
    id: null,
    text: "",
  },
};

export const flirtsSlice = createSlice({
  name: "flirts",
  initialState,
  reducers: {
    setActiveFlirt: (state, action) => {
      state.activeFlirt = {
        ...state.activeFlirt,
        ...action.payload,
      };
    },
    clearActiveFlirt: (state) => {
      state.activeFlirt = initialState.activeFlirt;
    },
  },
});

export const { setActiveFlirt, clearActiveFlirt } = flirtsSlice.actions;

export default flirtsSlice.reducer;

// Memoized selectors for flirts data
export const selectActiveFlirt = (state) => state.flirts.activeFlirt;

const selectFlirtHistoryResults = (state, uuid) => {
  return apiSlice.endpoints.getFlirtHistory.select({ uuid })(state);
};

export const selectAllFlirts = createSelector(
  [selectFlirtHistoryResults],
  (flirtHistoryResult) => {
    return flirtHistoryResult?.data?.flirts || [];
  }
);

export const selectHasMoreFlirts = createSelector(
  [selectFlirtHistoryResults],
  (flirtHistoryResult) => {
    return flirtHistoryResult?.data?.hasMore || false;
  }
);

const selectSuggestedFlirtsResults = (state, profileData) =>
  apiSlice.endpoints.getSuggestedFlirts.select(profileData)(state);

export const selectSuggestedFlirts = createSelector(
  [selectSuggestedFlirtsResults],
  (suggestedFlirtsResult) => {
    return suggestedFlirtsResult?.data || [];
  }
);

const selectTopFlirtsResults = (state, uuid) =>
  apiSlice.endpoints.getTopFlirts.select(uuid)(state);

export const selectTopFlirts = createSelector(
  [selectTopFlirtsResults],
  (topFlirtsResult) => {
    return topFlirtsResult?.data || [];
  }
);

const selectAverageFlirtScoreResults = (state, uuid) =>
  apiSlice.endpoints.getAverageFlirtScore.select(uuid)(state);

export const selectAverageFlirtScore = createSelector(
  [selectAverageFlirtScoreResults],
  (averageFlirtScoreResult) => {
    return averageFlirtScoreResult?.data || 0;
  }
);

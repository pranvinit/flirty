import { apiSlice } from "@/lib/redux/apiSlice";

export const apiSliceWithFlirts = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFlirtHistory: builder.query({
      query: ({ uuid, page = 1 }) => ({
        url: `/flirts`,
        params: { uuid, page },
        method: "GET",
      }),
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return `${endpointName}-${queryArgs.uuid}`;
      },

      merge: (currentCache, response, { arg }) => {
        const { page } = arg;
        // If no current cache or page 1, return fresh data
        if (!currentCache || page === 1) {
          return response;
        }

        // merge the new data into the current cache
        const newData = [...currentCache.flirts, ...response.flirts];
        const result = {
          ...response,
          flirts: newData,
        };

        return result;
      },

      forceRefetch({ currentArg, previousArg }) {
        return currentArg.uuid !== previousArg.uuid;
      },

      providesTags: ["Flirt"],
    }),

    createFlirt: builder.mutation({
      query: ({ uuid, flirt, profileData }) => ({
        url: "/flirts",
        body: { uuid, flirt, profileData },
        method: "POST",
      }),
      async onQueryStarted({ uuid }, { dispatch, queryFulfilled }) {
        try {
          const { data: newFlirt } = await queryFulfilled;
          dispatch(
            apiSliceWithFlirts.util.updateQueryData(
              "getFlirtHistory",
              { uuid },
              (draft) => {
                draft.flirts.unshift(newFlirt);
              }
            )
          );
        } catch (err) {
          console.error("Failed to create flirt");
        }
      },
    }),
    updateFlirt: builder.mutation({
      query: ({ uuid, flirtId, updatedFlirt, profileData }) => ({
        url: `/flirts/${flirtId}`,
        body: { uuid, updatedFlirt, profileData },
        method: "PATCH",
      }),
      async onQueryStarted({ uuid }, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedFlirtData } = await queryFulfilled;
          dispatch(
            apiSliceWithFlirts.util.updateQueryData(
              "getFlirtHistory",
              { uuid },
              (draft) => {
                const index = draft.flirts.findIndex(
                  (flirt) => flirt.id === updatedFlirtData.id
                );
                if (index !== -1) {
                  draft.flirts[index] = updatedFlirtData;
                }
              }
            )
          );
        } catch (err) {
          console.error("Failed to update flirt");
        }
      },
    }),
    deleteFlirt: builder.mutation({
      query: ({ uuid, flirtId }) => ({
        url: `/flirts/${flirtId}`,
        body: { uuid },
        method: "DELETE",
      }),
      async onQueryStarted({ uuid }, { dispatch, queryFulfilled }) {
        try {
          const { data: deletedFlirt } = await queryFulfilled;
          dispatch(
            apiSliceWithFlirts.util.updateQueryData(
              "getFlirtHistory",
              { uuid },
              (draft) => {
                draft.flirts = draft.flirts.filter(
                  (flirt) => flirt.id !== deletedFlirt.id
                );
              }
            )
          );
        } catch (err) {
          console.error("Failed to delete flirt");
        }
      },
    }),
    getSuggestedFlirts: builder.query({
      query: (profileData) => ({
        url: "/flirts/flirt-suggestions",
        method: "POST",
        body: { profileData },
      }),
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return `${endpointName}-${JSON.stringify(queryArgs)}`;
      },
      providesTags: ["Suggestion"],
    }),

    getTopFlirts: builder.query({
      query: (uuid) => ({
        url: "/flirts/top-flirts",
        body: { uuid },
        method: "POST",
      }),
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return `${endpointName}-${queryArgs}`;
      },
    }),
    getAverageFlirtScore: builder.query({
      query: (uuid) => ({
        url: "/flirts/ai-score",
        body: { uuid },
        method: "POST",
      }),
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return `${endpointName}-${queryArgs}`;
      },
    }),
  }),
});

export const {
  useGetFlirtHistoryQuery,
  useGetSuggestedFlirtsQuery,
  useGetTopFlirtsQuery,
  useGetAverageFlirtScoreQuery,
  useCreateFlirtMutation,
  useUpdateFlirtMutation,
  useDeleteFlirtMutation,
} = apiSliceWithFlirts;

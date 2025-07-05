import { apiSlice } from "@/lib/redux/apiSlice";

export const apiSliceWithProfile = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: (uuid) => ({
        url: `/profile/${uuid}`,
        method: "GET",
      }),
    }),
    updateProfile: builder.mutation({
      query: ({ uuid, profileData }) => ({
        url: `/profile/${uuid}`,
        body: { profileData },
        method: "PATCH",
      }),
    }),
    judgeProfile: builder.query({
      query: (profileData) => ({
        url: "/profile/judge-profile",
        body: { profileData },
        method: "POST",
      }),
    }),
    uploadAvatar: builder.mutation({
      query: ({ uuid, file }) => {
        const formData = new FormData();
        formData.append("avatar", file);
        formData.append("uuid", uuid);

        return {
          url: "/profile/upload-avatar",
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useJudgeProfileQuery,
  useUploadAvatarMutation,
} = apiSliceWithProfile;

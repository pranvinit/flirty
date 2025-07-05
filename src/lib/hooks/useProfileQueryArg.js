import { useMemo } from "react";

export function useProfileQueryArg(profileData) {
  return useMemo(
    () => ({
      name: profileData?.name,
      bio: profileData?.bio,
      hobbies: profileData?.hobbies,
      traits: profileData?.traits,
    }),
    [profileData]
  );
}

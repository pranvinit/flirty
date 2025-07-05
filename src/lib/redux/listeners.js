import { apiSlice } from "./apiSlice";
import { clearProfile } from "@/features/profile/model/profileSlice";
import { toast } from "react-toastify";

export function setupListeners(startListening) {
  if (typeof window === "undefined") return;

  startListening({
    matcher: apiSlice.endpoints.updateProfile.matchFulfilled,
    effect: async (action) => {
      const { profileData } = action.meta.arg.originalArgs;
      const updatedField = Object.keys(profileData)[0];
      toast.success(`Profile ${updatedField} updated! 🥀`);
    },
  });

  startListening({
    matcher: apiSlice.endpoints.createFlirt.matchFulfilled,
    effect: async (action) => {
      const { ai_score } = action.payload;
      toast.success(`You got an AI score of ${ai_score} on your flirt! 🫦`);
    },
  });

  startListening({
    matcher: apiSlice.endpoints.updateFlirt.matchFulfilled,
    effect: async (action) => {
      const { ai_score } = action.payload;
      toast.success(
        `You got an AI score of ${ai_score} on your updated flirt! 🫦`
      );
    },
  });

  startListening({
    matcher: apiSlice.endpoints.deleteFlirt.matchFulfilled,
    effect: async (action) => {
      const { id } = action.payload;
      toast.warn(`Flirt with id ${id} deleted successfully 🫦`);
    },
  });

  startListening({
    actionCreator: clearProfile.fulfilled,
    effect: async () => {
      toast.info("Profile cleared 🕵🏼‍♂️");
    },
  });
}

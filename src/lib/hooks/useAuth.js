// src/lib/hooks/useAuth.js

import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  initializeApp,
  selectProfile,
  selectIsInitializing,
} from "../../features/profile/model/profileSlice";

export function useAuth() {
  const isInitializing = useSelector(selectIsInitializing);
  const profileState = useSelector(selectProfile);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isInitializing) {
      dispatch(initializeApp());
    }
  }, [isInitializing, dispatch]);

  return {
    uuid: profileState.uuid,
    isAuthenticated: !!profileState.uuid,
    profileData: profileState,
    authLoading: isInitializing,
  };
}

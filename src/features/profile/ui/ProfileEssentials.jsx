import "./css/profile-essentials.css";
import { useState, useRef, useCallback } from "react";
import {
  useUploadAvatarMutation,
  useUpdateProfileMutation,
} from "../api/profileApi";
import { useAuth } from "@/lib/hooks/useAuth";
import PrimarySpinner from "@/components/ui/spinners/PrimarySpinner";

import { debounce } from "@/lib/utils/debounce";

function ProfileEssentials({ name: nameProp, avatar_url: avatarUrlProp }) {
  const fileInputRef = useRef(null);

  const [name, setName] = useState(nameProp || "");
  const [avatarUrl, setAvatarUrl] = useState(avatarUrlProp || "");

  const { uuid } = useAuth();
  const [uploadAvatar, { isLoading: isUploadingAvatar }] =
    useUploadAvatarMutation();
  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateProfileMutation();

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith("image/")) {
      try {
        const result = await uploadAvatar({ file, uuid }).unwrap();

        setAvatarUrl(result.avatar_url);

        await updateProfile({
          uuid,
          profileData: { avatar_url: result.avatar_url },
        }).unwrap();
      } catch (error) {
        console.error("Error uploading avatar:", error);
      }
    }
  };

  const debouncedUpdateProfile = useCallback(
    debounce(async (newName) => {
      if (!uuid || !newName.trim()) return;
      try {
        await updateProfile({
          uuid,
          profileData: { name: newName },
        }).unwrap();
      } catch (error) {
        console.error("Error updating name:", error);
      }
    }, 500),
    [updateProfile, uuid]
  );

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);

    if (newName.trim()) {
      debouncedUpdateProfile(newName);
    }
  };

  return (
    <div className="profile-essentials">
      <input
        type="file"
        ref={fileInputRef}
        id="avatar_url"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleAvatarUpload}
      />
      <div
        className="avatar-preview"
        onClick={() => !isUploadingAvatar && fileInputRef.current.click()}
        style={{ cursor: isUploadingAvatar ? "wait" : "pointer" }}
      >
        {isUploadingAvatar ? (
          <div className="avatar-spinner">
            <PrimarySpinner style={{ fontSize: 48, color: "var(--accent)" }} />
          </div>
        ) : (
          <img
            src={avatarUrl || "https://placehold.co/100x100"}
            alt="Avatar Preview"
          />
        )}
      </div>
      <div className="name-input g-fg">
        <input
          type="text"
          id="name"
          placeholder="Name"
          value={name}
          onChange={handleNameChange}
        />
      </div>
    </div>
  );
}

export default ProfileEssentials;

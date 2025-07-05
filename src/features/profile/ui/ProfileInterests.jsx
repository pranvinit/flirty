import "./css/profile-interests.css";
import { useState, useCallback } from "react";
import { useUpdateProfileMutation } from "../api/profileApi";
import { useAuth } from "@/lib/hooks/useAuth";
import { debounce } from "@/lib/utils/debounce";

function ProfileInterests({ hobbies = [], traits = [], bio = "" }) {
  const [profileData, setProfileData] = useState({
    hobbies,
    traits,
    bio,
  });

  const [hobbiesInput, setHobbiesInput] = useState("");
  const [traitsInput, setTraitsInput] = useState("");

  const { uuid } = useAuth();
  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateProfileMutation();

  const debouncedUpdateProfile = useCallback(
    debounce(async (profileData) => {
      if (!uuid) return;
      try {
        await updateProfile({
          uuid,
          profileData: { ...profileData },
        }).unwrap();
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }, 500),
    [updateProfile, uuid]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "hobbies") setHobbiesInput(value);
    if (name === "traits") setTraitsInput(value);
    if (name === "bio") {
      setProfileData((prev) => ({ ...prev, bio: value }));
      debouncedUpdateProfile({ bio: value });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key !== "Enter") return;

    e.preventDefault();
    const { name, value } = e.target;

    if (name === "bio" || !value.trim()) return;

    if (name === "hobbies") {
      setProfileData((prev) => ({
        ...prev,
        hobbies: [...prev.hobbies, value.trim()],
      }));
      setHobbiesInput("");
    } else if (name === "traits") {
      setProfileData((prev) => ({
        ...prev,
        traits: [...prev.traits, value.trim()],
      }));
      setTraitsInput("");
    }
    debouncedUpdateProfile({
      [name]: [...(profileData[name] || []), value.trim()],
    });
  };

  return (
    <div className="profile-interests g-bg">
      {isUpdatingProfile && <p>Updating profile...</p>}
      <div className="hobbies-section">
        <label htmlFor="hobbies">Your hobbies</label>
        <div className="chip-container">
          {profileData.hobbies.map((hobby, index) => (
            <span key={index} className="chip g-fg">
              {hobby}
            </span>
          ))}
        </div>
        <input
          type="text"
          id="hobbies"
          name="hobbies"
          className="g-fg profile-input"
          value={hobbiesInput}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Add a hobby"
        />
      </div>

      <div className="traits-section">
        <label htmlFor="traits">Your traits</label>

        <div className="chip-container">
          {profileData.traits.map((trait, index) => (
            <span key={index} className="chip g-fg">
              {trait}
            </span>
          ))}
        </div>
        <input
          type="text"
          id="traits"
          name="traits"
          className="g-fg profile-input"
          value={traitsInput}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Add a trait"
        />
      </div>

      <div className="bio-section">
        <label htmlFor="bio">Your Bio</label>
        <textarea
          id="bio"
          name="bio"
          className="g-fg profile-textarea"
          value={profileData.bio || ""}
          onChange={handleChange}
          placeholder="Tell us about yourself..."
        />
      </div>
    </div>
  );
}

export default ProfileInterests;

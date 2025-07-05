"use client";
import "./page.css";

import { useState } from "react";
import { useAuth } from "../lib/hooks/useAuth";

// component imports
import AddFlirt from "../features/flirts/ui/AddFlirt";
import ProfileEssentials from "../features/profile/ui/ProfileEssentials";
import ProfileInterests from "../features/profile/ui/ProfileInterests";
import SuggestedFlirtList from "../features/flirts/ui/SuggestedFlirtList";
import TopFlirtList from "../features/flirts/ui/TopFlirtList";
import ProfileJudgement from "../features/profile/ui/ProfileJudgement";
import FlirtHistoryList from "../features/flirts/ui/FlirtHistoryList";
import AuthLoading from "../components/ui/auth-loading/AuthLoading";
import DiamondRoundedIcon from "@mui/icons-material/DiamondRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import ThemeManager from "@/components/ThemeManager";
import { useSelector } from "react-redux";
import { selectTheme } from "@/features/ui/model/uiSlice";

function Home() {
  const { authLoading, profileData } = useAuth();

  const [activeTab, setActiveTab] = useState("top");

  if (authLoading) {
    return <AuthLoading />;
  }

  return (
    <div className="home">
      <div className="top">
        <div className="left">
          <FlirtHistoryList />
        </div>
        <div className="center">
          <div className="center-top g-bg">
            <ProfileEssentials
              name={profileData.name}
              avatar_url={profileData.avatar_url}
            />
            <ProfileJudgement />
          </div>
          <ProfileInterests
            hobbies={profileData.hobbies}
            traits={profileData.traits}
            bio={profileData.bio}
          />
        </div>
        <div className="right">
          <div className="tab-bar g-bg">
            <button
              className={`tab-button ${activeTab === "top" ? "g-fg" : ""}`}
              onClick={() => setActiveTab("top")}
            >
              Top
              <em>
                <DiamondRoundedIcon fontSize="small" />
              </em>
            </button>
            <button
              className={`tab-button ${
                activeTab === "suggested" ? "g-fg" : ""
              }`}
              onClick={() => setActiveTab("suggested")}
            >
              Suggested
              <em>
                <AutoAwesomeRoundedIcon fontSize="small" />
              </em>
            </button>
          </div>
          {activeTab === "top" && <TopFlirtList />}
          {activeTab === "suggested" && <SuggestedFlirtList />}
        </div>
      </div>
      <div className="bottom">
        <AddFlirt />
      </div>
    </div>
  );
}

export default function () {
  const theme = useSelector(selectTheme);
  return (
    <ThemeManager theme={theme}>
      <Home />
    </ThemeManager>
  );
}

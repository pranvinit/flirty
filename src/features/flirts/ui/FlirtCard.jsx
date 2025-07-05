import { useState, useRef, useEffect, forwardRef } from "react";
import "./css/flirt-card.css";
import { useDispatch } from "react-redux";
import { useDeleteFlirtMutation } from "../api/flirtsApi";
import { setActiveFlirt } from "../model/flirtsSlice";
import { useAuth } from "@/lib/hooks/useAuth";

import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import InfoCard from "@/components/ui/info-card/InfoCard";

const FlirtCard = forwardRef(
  (
    {
      flirt,
      isSelected,
      isSuggested = false,
      hasActions = false,
      onClick = () => {},
    },
    ref
  ) => {
    const { uuid } = useAuth();
    const dispatch = useDispatch();

    const [deleteFlirt, { isLoading: isDeletingFlirt }] =
      useDeleteFlirtMutation();

    const [isExpanded, setIsExpanded] = useState(false);
    const contentRef = useRef(null);

    const toggleExpand = (e) => {
      e.stopPropagation();
      setIsExpanded((prev) => !prev);
    };

    useEffect(() => {
      if (contentRef.current) {
        if (isExpanded) {
          contentRef.current.style.maxHeight =
            contentRef.current.scrollHeight + "px";
        } else {
          contentRef.current.style.maxHeight = "0px";
        }
      }
    }, [isExpanded]);

    const handleUpdate = (e) => {
      e.stopPropagation();
      window.scrollTo({
        top: document.body.scrollHeight,
      });
      dispatch(setActiveFlirt({ id: flirt.id, text: flirt.text }));
    };

    const handleDelete = async (e) => {
      e.stopPropagation();
      try {
        await deleteFlirt({ uuid, flirtId: flirt.id }).unwrap();
      } catch (error) {
        console.error("Failed to delete flirt:", error);
      }
    };

    return (
      <li
        ref={ref}
        key={flirt.id}
        data-selected={isSelected}
        className="flirt-card g-fg"
        onClick={onClick}
      >
        <div className="flirt-header">
          <p>{flirt.text}</p>
          <div className="flirt-icons g-fg-color">
            <button onClick={toggleExpand}>
              {!isExpanded ? (
                <AutoAwesomeRoundedIcon />
              ) : (
                <ExpandLessRoundedIcon />
              )}
            </button>
          </div>
        </div>
        {!isSuggested && (
          <small>
            {new Date(flirt.created_at).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </small>
        )}
        <div ref={contentRef} className="judgement-content">
          {!isSuggested ? (
            <InfoCard
              items={[
                { label: "Score", value: flirt.ai_score },
                { label: "Feedback", value: flirt.ai_feedback },
              ]}
            />
          ) : (
            <InfoCard
              items={[
                { label: "Estimated Score", value: flirt.estimatedScore },
                { label: "Style", value: flirt.style },
              ]}
            />
          )}
        </div>
        {hasActions && (
          <div className="flirt-actions">
            <button
              className={`action-button ${!isSelected ? "g-fg" : "g-fg-color"}`}
              onClick={handleUpdate}
              disabled={isDeletingFlirt}
            >
              <EditRoundedIcon fontSize="small" />
            </button>
            <button
              className={`action-button g-fg-color`}
              onClick={handleDelete}
              disabled={isDeletingFlirt}
            >
              <DeleteOutlineRoundedIcon fontSize="small" />
            </button>
          </div>
        )}
      </li>
    );
  }
);

export default FlirtCard;

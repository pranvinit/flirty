import "./css/add-flirt.css";
import {
  useCreateFlirtMutation,
  useUpdateFlirtMutation,
} from "../api/flirtsApi";
import {
  selectActiveFlirt,
  setActiveFlirt,
  clearActiveFlirt,
} from "../model/flirtsSlice";

import { useSelector, useDispatch } from "react-redux";

import { useAuth } from "@/lib/hooks/useAuth";
import CustomButton from "@/components/ui/custom-buttons/CustomButton";

function AddFlirtForm() {
  const { uuid, profileData } = useAuth();

  const activeFlirt = useSelector(selectActiveFlirt);
  const dispatch = useDispatch();

  const handleFlirtChange = (e) => {
    const newFlirt = e.target.value;
    dispatch(setActiveFlirt({ text: newFlirt }));
  };

  const [createFlirt, { isLoading: isCreating }] = useCreateFlirtMutation({
    skip: !uuid,
  });

  const [updateFlirt, { isLoading: isUpdating }] = useUpdateFlirtMutation({
    skip: !uuid,
  });

  const handleAddFlirt = async () => {
    if (!activeFlirt.text.trim() || !uuid) return;

    try {
      if (activeFlirt.id) {
        const flirtData = {
          text: activeFlirt.text,
          updated_at: new Date().toISOString(),
        };

        await updateFlirt({
          uuid,
          flirtId: activeFlirt.id,
          updatedFlirt: flirtData,
          profileData,
        }).unwrap();
      } else {
        await createFlirt({
          uuid,
          flirt: activeFlirt.text,
          profileData,
        }).unwrap();
      }

      dispatch(clearActiveFlirt());
    } catch (error) {
      console.error("Failed to create flirt:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddFlirt();
    }
  };

  const getButtonText = () => {
    if (isCreating) return "Creating...";
    if (isUpdating) return "Updating...";
    return activeFlirt.id ? "Update Flirt" : "Submit Flirt";
  };

  return (
    <div className="add-flirt g-bg">
      <input
        className="add-flirt-input g-fg"
        onChange={handleFlirtChange}
        onKeyDown={handleKeyDown}
        value={activeFlirt.text || ""}
        placeholder="Type your flirt here..."
      />
      <div className="add-flirt-actions">
        <CustomButton
          text={getButtonText()}
          onClick={handleAddFlirt}
          disabled={isCreating || isUpdating}
        />
        <CustomButton
          text={"Cancel"}
          variant="warning"
          onClick={() => dispatch(clearActiveFlirt())}
          icon="cancel"
          disabled={isCreating || isUpdating}
        />
      </div>
    </div>
  );
}

export default AddFlirtForm;

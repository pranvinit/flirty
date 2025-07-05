import "./css/suggested-flirts.css";
import { useGetSuggestedFlirtsQuery } from "../api/flirtsApi";
import { setActiveFlirt, selectSuggestedFlirts } from "../model/flirtsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@/lib/hooks/useAuth";
import { useProfileQueryArg } from "@/lib/hooks/useProfileQueryArg";
import FlirtCard from "./FlirtCard";
import PrimarySpinner from "@/components/ui/spinners/PrimarySpinner";

export default function SuggestedFlirtList() {
  const { uuid, profileData } = useAuth();
  const dispatch = useDispatch();

  const queryArg = useProfileQueryArg(profileData);

  const { isLoading, isFetching, isError } = useGetSuggestedFlirtsQuery(
    queryArg,
    {
      skip: !uuid,
      refetchOnMountOrArgChange: true,
    }
  );

  const suggestedFlirts = useSelector((state) =>
    selectSuggestedFlirts(state, queryArg)
  );

  const handleSuggestedFlirtClick = (flirt) => {
    dispatch(setActiveFlirt({ id: null, text: flirt.text }));
    window.scrollTo({
      top: document.body.scrollHeight,
    });
  };

  return (
    <div className="suggested-flirts g-bg">
      <h2>Suggested Flirts</h2>
      {(isLoading || isFetching) && (
        <PrimarySpinner
          style={{
            fontSize: 24,
            color: "var(--accent)",
            marginTop: "var(--spacing-md)",
          }}
        />
      )}
      {isError && <p>Error loading suggested flirts.</p>}
      {suggestedFlirts && suggestedFlirts.length > 0 && (
        <ul className="suggested-flirt-list">
          {suggestedFlirts.map((flirt, i) => (
            <FlirtCard
              key={i}
              isSuggested={true}
              hasActions={false}
              flirt={flirt}
              onClick={() => handleSuggestedFlirtClick(flirt)}
            />
          ))}
        </ul>
      )}
      {suggestedFlirts?.length === 0 && !isLoading && !isFetching && (
        <p>No suggested flirts available.</p>
      )}
    </div>
  );
}

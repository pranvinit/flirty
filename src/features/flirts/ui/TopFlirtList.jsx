import "./css/top-flirts.css";
import {
  useGetAverageFlirtScoreQuery,
  useGetTopFlirtsQuery,
} from "../api/flirtsApi";
import { selectAverageFlirtScore, selectTopFlirts } from "../model/flirtsSlice";
import { useSelector } from "react-redux";
import { useAuth } from "@/lib/hooks/useAuth";
import PrimarySpinner from "@/components/ui/spinners/PrimarySpinner";
import FlirtCard from "./FlirtCard";
import AIScore from "./AIScore";

export default function TopFlirtList() {
  const { uuid } = useAuth();
  const { isLoading, isFetching, isError } = useGetTopFlirtsQuery(uuid, {
    skip: !uuid,
    refetchOnMountOrArgChange: true,
  });

  const topFlirts = useSelector((state) => selectTopFlirts(state, uuid));

  const { isLoading: isScoreLoading, isError: isScoreError } =
    useGetAverageFlirtScoreQuery(uuid, {
      skip: !uuid,
      refetchOnMountOrArgChange: true,
    });

  const aiScore = useSelector((state) => selectAverageFlirtScore(state, uuid));

  return (
    <div className="top-flirts g-bg">
      <div className="top-flirts-header">
        <h2>Top Flirts</h2>
        <AIScore
          isLoading={isScoreLoading}
          isError={isScoreError}
          score={aiScore}
          label="Flirt Score"
        />
      </div>
      {isLoading ||
        (isFetching && (
          <PrimarySpinner
            style={{
              fontSize: 24,
              color: "var(--accent)",
              marginTop: "var(--spacing-md)",
            }}
          />
        ))}
      {isError && <p>Error loading top flirts.</p>}
      {topFlirts && topFlirts.length > 0 && (
        <ul className="top-flirt-list">
          {topFlirts.map((flirt) => (
            <FlirtCard hasActions={false} key={flirt.id} flirt={flirt} />
          ))}
        </ul>
      )}
      {topFlirts?.length === 0 && !isLoading && !isFetching && (
        <p>No top flirts available.</p>
      )}
    </div>
  );
}

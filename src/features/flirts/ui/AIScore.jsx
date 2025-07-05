import "./css/ai-score.css";
import PrimarySpinner from "@/components/ui/spinners/PrimarySpinner";

function AIScore({
  isLoading = false,
  isError = null,
  label = "Score",
  score = 0,
}) {
  return (
    <div className="ai-score-section g-bg">
      <p>{label}</p>
      {isLoading && (
        <PrimarySpinner
          style={{
            fontSize: 24,
            color: "var(--accent)",
          }}
        />
      )}
      {isError && <p>Error loading.</p>}
      {!isLoading && score && (
        <div className="ai-score g-fg">
          <strong>{score}</strong>
        </div>
      )}
    </div>
  );
}

export default AIScore;

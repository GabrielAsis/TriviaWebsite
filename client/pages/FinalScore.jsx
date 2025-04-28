import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleAmountChange, handleScoreChange } from "../redux/actions";
import axios from "axios"; // Import axios for API calls
import { useEffect, useRef } from "react"; // Add useRef import

const FinalScore = () => {
  const dispatch = useDispatch();
  const { score } = useSelector((state) => state);
  const navigate = useNavigate();
  const pointsUpdated = useRef(false); // Add ref to track if points were updated

  // Update user's points in the backend
  useEffect(() => {
    const updatePoints = async () => {
      // Skip if already updated or score is invalid
      if (pointsUpdated.current || score <= 0) {
        return;
      }
  
      try {
        await axios.post(
          "/update-points",
          { points: score * 15 }, // Send the score to the backend
          { withCredentials: true } // Ensure cookies are sent for authentication
        );
        // Mark as updated to prevent duplicate calls
        pointsUpdated.current = true;
        console.log("Points updated successfully:", score);
      } catch (error) {
        console.error("Failed to update points:", error);
        alert("Failed to update your points. Please try again later.");
      }
    };
  
    updatePoints();
  }, [score]);

  const handleBackToSettings = () => {
    dispatch(handleScoreChange(0));
    dispatch(handleAmountChange(50));
    navigate("/");
  };

  return (
    <div className="mt-20 text-center">
      <h2 className="text-3xl font-bold mb-5">Your Final Score: {score}</h2>
      <button
        onClick={handleBackToSettings}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Back to Home
      </button>
    </div>
  );
};

export default FinalScore;
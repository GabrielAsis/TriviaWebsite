import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleAmountChange, handleScoreChange } from "../redux/actions";

const FinalScore = () => {
  const dispatch = useDispatch();
  const { score } = useSelector((state) => state);
  const navigate = useNavigate();

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
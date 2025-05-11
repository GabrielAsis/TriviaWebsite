import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, Link, useNavigate } from "react-router-dom";
import SelectField from "../src/Components/SelectField";
import BoxRadioField from "../src/Components/BoxRadioField";
import TextFieldComp from "../src/Components/TextFieldComp";
import useAxios from "../src/hooks/useAxios";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight } from "lucide-react";
import toast from "react-hot-toast"; // Import toast

const Settings = () => {
  const navigate = useNavigate();
  
  // Get all required values from Redux store
  const { 
    question_category, 
    question_difficulty, 
    amount_of_question 
  } = useSelector((state) => state);
  
  // Use local state for timer instead of Redux
  const [blitzTimer, setBlitzTimer] = useState("");

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode"); // Default to custom if no mode

  const isBlitzMode = mode === "blitz";
  const isEndlessMode = mode === "endless";
  const isStrikeMode = mode === "strike"; 

  const { response, error, loading } = useAxios({ url: "/api_category.php" });

  // hide/show nav
  useEffect(() => {
    const navbar = document.getElementById("navbar");
    if (navbar) navbar.style.display = "none";
    return () => {
      if (navbar) navbar.style.display = "block";
    };
  }, []);

  // Timer input handler - use local state
  const handleTimerChange = (e) => {
    const value = parseInt(e.target.value);
    setBlitzTimer(value);
  };

  // Function to validate form and navigate
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    
    // Validate form (check if required fields are set)
    if (!question_category) {
      toast.error("Please select a category");
      return;
    }
    
    if (!question_difficulty) {
      toast.error("Please select a difficulty level");
      return;
    }
    
    if (!amount_of_question || amount_of_question < 1) {
      toast.error("Please enter a valid number of questions");
      return;
    }

    if (amount_of_question > 20) {
      toast.error("Maximum 20 questions allowed");
      return;
    }
    
    // Validate timer if in blitz mode
    if (isBlitzMode) {
      const timerValue = blitzTimer === "" ? 0 : parseInt(blitzTimer);
      if (!timerValue || timerValue < 10) {
        toast.error("Timer must be at least 10 seconds");
        return;
      }
      
      if (timerValue > 300) {
        toast.error("Timer cannot exceed 5 minutes (300 seconds)");
        return;
      }
    }
    
    // All validations passed, show success toast and navigate
    toast.success("Starting your trivia game!");
    
    // Make sure to include the mode parameter AND timer in URL for blitz mode
    if (isBlitzMode) {
      navigate(`/questions?mode=${mode}&timer=${blitzTimer}`);
    } else {
      navigate(`/questions?mode=${mode}`);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col space-y-4 justify-center items-center w-full h-[100vh] text-center">
        <div className="w-18 h-18 border-8 border-t-8 border-gray-300 border-t-primary rounded-full animate-spin"></div>
        <h3 className="ml-2">Loading Settings...</h3>
      </div>
    );
  }

  if (error) {
    console.log("Error Details:", error);
    console.log("Response Data:", response);
    
    // Use toast for error instead of returning error UI
    toast.error("Failed to load settings. Please try again.");
    
    return (
      <div className="flex flex-col space-y-4 justify-center items-center w-full h-[100vh] text-center">
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  const difficultyOptions = [
    { id: "easy", name: "Easy" },
    { id: "medium", name: "Medium" },
    { id: "hard", name: "Hard" },
  ];

  return (
    <>
      <div className="flex flex-col justify-center items-center w-full h-[100vh] bg-off-white relative">
        <div className="absolute top-2 left-2">
          <Link to="/">
            <Button variant="link" className="text-primary" ><ArrowLeft strokeWidth={2}/> Back to Home</Button>
          </Link>
        </div>
        <div className="p-8 bg-white w-[700px] m-auto rounded-xl shadow-sm">
          <form onSubmit={handleSubmit} className="text-center flex flex-col gap-2">
            <div>
              <h2 className="text-2xl font-bold mb-2">{mode?.charAt(0).toUpperCase() + mode?.slice(1)} Mode</h2>
              <p className="text-gray mb-2">
                {isBlitzMode 
                  ? "Welcome to Blitz! Race the clock, answer fast, and rack up points before time runs out!" 
                  : isEndlessMode 
                    ? "Welcome to Endless!  Answer endlessly with 3 lives. Lose them all, and it's game over!" 
                  : isStrikeMode
                    ? "Welcome to Strike! Keep answering questions until you miss one. How long can you go?"
                    : "Welcome! Customize your trivia experience."}
              </p>
            </div>
            
            {/* Category dropdown */}
            <SelectField 
              options={response.trivia_categories} 
              label="Category" 
              className="w-full" 
            />
            
            {/* Box radio buttons for difficulty */}
            <BoxRadioField options={difficultyOptions} label="Difficulty" />
            
            {/* Number of questions */}
            <TextFieldComp />
            
            {/* Timer input - only shown in Blitz mode */}
            {isBlitzMode && (
              <div className="mt-5 space-y-2">
                <Label htmlFor="timer">Timer (seconds)</Label>
                <Input
                  id="timer"
                  type="number"
                  value={blitzTimer}
                  onChange={handleTimerChange}
                  placeholder="Enter time in seconds"
                  min="10"
                  max="300"
                  className="w-full"
                />
              </div>
            )}
            
            <div className="mt-4">
              {/* Use button type="submit" to trigger form validation */}
              <Button type="submit" className="px-6 py-2 gap-2">
                Play! <ArrowRight />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Settings;
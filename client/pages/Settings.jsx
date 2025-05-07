import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, Link, useNavigate } from "react-router-dom";
import SelectField from "../src/Components/SelectField";
import BoxRadioField from "../src/Components/BoxRadioField";
import TextFieldComp from "../src/Components/TextFieldComp";
import useAxios from "../src/hooks/useAxios";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();
  
  // Get all required values from Redux store
  const { 
    question_category, 
    question_difficulty, 
    question_type,
    amount_of_question 
  } = useSelector((state) => state);

  // State to track validation errors
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    const navbar = document.getElementById("navbar");
    if (navbar) navbar.style.display = "none";
    return () => {
      if (navbar) navbar.style.display = "block";
    };
  }, []);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode") || "custom"; // Default to custom if no mode

  const isBlitzMode = mode === "blitz";
  const isEndlessMode = mode === "endless";
  const isCustomMode = mode === "custom"; 

  const { response, error, loading } = useAxios({ url: "/api_category.php" });

  // Function to validate form and navigate
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    
    // Log current values to help debug
    console.log("Form submission values:", {
      category: question_category,
      difficulty: question_difficulty,
      type: question_type,
      amount: amount_of_question
    });
    
    // Validate form (check if required fields are set)
    if (!question_category) {
      setValidationError("Please select a category");
      return;
    }
    
    if (!question_difficulty) {
      setValidationError("Please select a difficulty level");
      return;
    }
    
    if (!question_type) {
      setValidationError("Please select a question type");
      return;
    }
    
    if (!amount_of_question || amount_of_question < 1) {
      setValidationError("Please enter a valid number of questions");
      return;
    }
    
    // All validations passed, clear errors and navigate
    setValidationError("");
    console.log("All validations passed, navigating to /questions");
    
    // Use the programmatic navigation instead of Link
    navigate(`/questions`);
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
    return (
      <div className="mt-20 text-center text-red-500">
        Something Went Wrong!
      </div>
    );
  }

  const difficultyOptions = [
    { id: "easy", name: "Easy" },
    { id: "medium", name: "Medium" },
    { id: "hard", name: "Hard" },
  ];

  const typeOptions = [
    { id: "multiple", name: "Multiple Choice" },
    { id: "boolean", name: "True/False" },
  ];

  return (
    <>
      <div className="flex flex-col justify-center items-center w-full h-[110vh] bg-off-white">
        <div className="p-8 bg-white w-[800px] m-auto rounded-xl shadow-sm">
          <form onSubmit={handleSubmit} className="text-center flex flex-col gap-2">
            <div>
              <h2 className="text-2xl font-bold mb-2">{mode?.charAt(0).toUpperCase() + mode?.slice(1)} Mode</h2>
              <p className="text-gray mb-2">
                {isBlitzMode 
                  ? "Welcome to Blitz! Race the clock, answer fast, and rack up points before time runs out!" 
                  : isEndlessMode 
                    ? "Welcome to Endless! Keep answering questions until you miss one. How long can you go?" 
                    : "Welcome! Customize your trivia experience with the options below."}
              </p>
            </div>
            
            {/* Display validation error if any */}
            {validationError && (
              <div className="my-2 p-2 bg-red-100 text-red-600 rounded-md">
                {validationError}
              </div>
            )}
            
            {/* Category dropdown */}
            <SelectField 
              options={response.trivia_categories} 
              label="Category" 
              className="w-full" 
            />
            
            {/* Box radio buttons for difficulty and type */}
            <BoxRadioField options={difficultyOptions} label="Difficulty" />
            <BoxRadioField options={typeOptions} label="Type" />
            
            {/* Number of questions */}
            <TextFieldComp />
            
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
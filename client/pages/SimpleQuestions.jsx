import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { decode } from "html-entities";
import axios from "axios";
import { ArrowLeft, ArrowRight } from "lucide-react";

const SimpleQuestions = () => {
  const navigate = useNavigate();
  
  // Basic state
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  
  // Use a ref to track if we should stop retrying
  const shouldStopRetrying = useRef(false);
  
  // Brute force fetch with retries regardless of errors
  const fetchQuestionsWithRetry = useCallback(async (maxRetries = 10) => {
    let attempt = 0;
    let success = false;
    
    // Reset the stop flag when starting a new fetch
    shouldStopRetrying.current = false;
    
    while (!success && attempt < maxRetries && !shouldStopRetrying.current) {
      try {
        attempt++;
        setRetryCount(attempt);
        
        // Simple request - 5 general knowledge questions
        const response = await axios.get('https://opentdb.com/api.php?amount=5');
        
        if (response.data.results && response.data.results.length > 0) {
          setQuestions(response.data.results);
          success = true;
          
          // Set flag to stop any further retries
          shouldStopRetrying.current = true;
          break;
        }
      } catch (err) {
        console.log(`Attempt ${attempt} failed, retrying in 1 second...`);
        
        // Check if component is still mounted and should continue
        if (shouldStopRetrying.current) {
          break;
        }
        
        // Wait 1 second before trying again (aggressively retrying)
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // Even if we couldn't get questions after max retries, stop loading
    setLoading(false);
  }, []);
  
  // Cleanup function to stop retries when unmounting
  useEffect(() => {
    return () => {
      // Set flag to stop retries when component unmounts
      shouldStopRetrying.current = true;
    };
  }, []);
  
  // Start fetching on component mount
  useEffect(() => {
    fetchQuestionsWithRetry();
  }, [fetchQuestionsWithRetry]);
  
  // Shuffle options when question changes
  useEffect(() => {
    if (!questions.length || !questions[questionIndex]) return;
    
    const currentQuestion = questions[questionIndex];
    const allOptions = [
      currentQuestion.correct_answer,
      ...currentQuestion.incorrect_answers
    ];
    
    // Simple shuffle
    for (let i = allOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
    }
    
    setOptions(allOptions);
  }, [questions, questionIndex]);
  
  // Handle answer selection
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };
  
  // Handle next button click
  const handleNext = () => {
    // Check if this question is already answered
    if (!answeredQuestions.includes(questionIndex)) {
      // Score the answer
      const isCorrect = selectedOption === questions[questionIndex].correct_answer;
      if (isCorrect) {
        setScore(prevScore => prevScore + 1);
      }
      
      // Mark as answered
      setAnsweredQuestions([...answeredQuestions, questionIndex]);
    }
    
    // Move to next question or finish quiz
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
      setSelectedOption("");
    } else {
      // End of quiz
      alert(`Quiz complete! Your score: ${score}/${questions.length}`);
      navigate("/");
    }
  };
  
  // Handle previous button click
  const handlePrevious = () => {
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
      setSelectedOption(answeredQuestions.includes(questionIndex - 1) ? "" : selectedOption);
    }
  };
  
  // Manual retry button handler
  const handleManualRetry = () => {
    setLoading(true);
    setRetryCount(0);
    setQuestions([]);
    fetchQuestionsWithRetry();
  };
  
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading questions (Attempt {retryCount})...</p>
          <p className="text-sm text-gray-500 mt-2">Aggressively retrying until successful</p>
        </div>
      </div>
    );
  }
  
  if (!questions.length) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-md text-center">
          <p className="text-red-500 mb-2">Failed to load questions after multiple attempts.</p>
          <p className="text-gray-600 mb-4">The API might be experiencing issues.</p>
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleManualRetry}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full min-h-screen bg-gray-100 p-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 p-4 text-white">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-white flex items-center">
              <ArrowLeft className="mr-2" size={18} /> Back to Home
            </Link>
            <div>Question {questionIndex + 1} of {questions.length}</div>
          </div>
        </div>
        
        {/* Question */}
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6">
            {decode(questions[questionIndex].question)}
          </h2>
          
          {/* Options */}
          <div className="space-y-3">
            {options.map((option, index) => {
              const decoded = decode(option);
              const isCorrectAnswer = decoded === decode(questions[questionIndex].correct_answer);
              const isSelected = decoded === selectedOption;
              const isAnswered = answeredQuestions.includes(questionIndex);
              
              let extraClass = "";
              let feedbackText = "";
              
              if (isAnswered) {
                if (isCorrectAnswer) {
                  extraClass = "border-green-500 bg-green-50";
                  feedbackText = "✓ Correct";
                } else if (isSelected) {
                  extraClass = "border-red-500 bg-red-50";
                  feedbackText = "✗ Incorrect";
                }
              } else if (isSelected) {
                extraClass = "border-blue-500 bg-blue-50";
              }
              
              return (
                <div
                  key={index}
                  className={`p-3 border rounded-lg cursor-pointer ${
                    isAnswered ? "cursor-default" : "hover:border-blue-300"
                  } ${extraClass || "border-gray-300"}`}
                  onClick={() => !isAnswered && handleOptionSelect(decoded)}
                >
                  <div className="flex justify-between">
                    <span>{decoded}</span>
                    {feedbackText && <span className="text-sm font-medium">{feedbackText}</span>}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            <button
              className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
              onClick={handlePrevious}
              disabled={questionIndex === 0}
            >
              <ArrowLeft className="inline mr-2" size={18} /> Previous
            </button>
            
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
              onClick={handleNext}
              disabled={!selectedOption && !answeredQuestions.includes(questionIndex)}
            >
              {questionIndex === questions.length - 1 ? "Finish" : "Next"} <ArrowRight className="inline ml-2" size={18} />
            </button>
          </div>
          
          {/* Score */}
          <div className="mt-4 text-sm text-gray-500">
            Current score: {score}/{answeredQuestions.length}
          </div>
          
          {/* Loaded info */}
          <div className="mt-2 text-xs text-gray-400">
            Loaded after {retryCount} {retryCount === 1 ? 'attempt' : 'attempts'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleQuestions;
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { handleScoreChange } from "../redux/actions";
import { decode } from "html-entities";
import axios from "axios";
import { Link } from 'react-router-dom'

// your Shadcn imports
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// assets imports
import { thinkingAvatar, endlessPng, blitzPng } from "../src/assets";

// icons
import { ArrowLeft, ArrowRight, Heart, HeartCrack, HeartOff } from "lucide-react";  

// number randomizer
const getRandomInt = (max) =>
  Math.floor(Math.random() * Math.floor(max));

const Questions = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode") || "normal"; // fallback
  
  // Get timer from URL if in blitz mode
  const timerParam = queryParams.get("timer");
  const defaultTimer = timerParam ? parseInt(timerParam) : 60;

  const isBlitz = mode === "blitz";
  const isEndless = mode === "endless";
  const isStrike = mode === "strike";

  // Get values from Redux store
  const question_category = useSelector((state) => state.question_category);
  const question_difficulty = useSelector((state) => state.question_difficulty);
  const question_type = useSelector((state) => state.question_type);
  const amount_of_question = useSelector((state) => state.amount_of_question);
  const score = useSelector((state) => state.score);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Store options for each question separately
  const [allOptions, setAllOptions] = useState([]);

  // USE STATES
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [scoredQuestions, setScoredQuestions] = useState([]);
  const [answerResults, setAnswerResults] = useState([]);
  
  // Timer states - use default from URL parameter or 60 seconds
  const [timer, setTimer] = useState(isBlitz ? defaultTimer : 0);
  const [isGameOver, setIsGameOver] = useState(false);
  
  // FIX: Set timerStarted state based on URL parameter or default to true
  // This ensures the timer actually starts counting down
  const timerStartedParam = queryParams.get("timerStarted");
  const [timerStarted, setTimerStarted] = useState(timerStartedParam === "true" || true);

  // Use a ref to track if we should stop retrying
  const shouldStopRetrying = useRef(false);

  const [lives, setLives] = useState(isEndless ? 3 : isStrike ? 1 : null);

  // Define handleFinish near the top to avoid reference issues
  const handleFinish = useCallback(() => {
    // Make sure questions have loaded and we have a valid questionIndex
    if (!questions.length || !questions[questionIndex]) return;
    
    const correct = decode(questions[questionIndex].correct_answer);
    const selected = selectedAnswers[questionIndex];
  
    // Only score if not already scored
    if (!scoredQuestions.includes(questionIndex)) {
      const isCorrect = selected === correct;
      setAnswerResults((prev) => {
        const updated = [...prev];
        updated[questionIndex] = isCorrect;
        return updated;
      });
  
      if (isCorrect) {
        dispatch(handleScoreChange(score + 1));
      }
  
      setScoredQuestions([...scoredQuestions, questionIndex]);
    }
  
    navigate("/score", { state: { fromQuestions: true } });
  }, [questions, questionIndex, selectedAnswers, scoredQuestions, dispatch, score, navigate]);
  
  // Get the selected option for the current question
  const selectedOption = selectedAnswers[questionIndex] || "";
  
  // hide/show nav
  useEffect(() => {
    const navbar = document.getElementById("navbar");
    if (navbar) navbar.style.display = "none";
    return () => {
      if (navbar) navbar.style.display = "block";
    };
  }, []);
  
  // Brute force fetch with retries regardless of errors
  const fetchQuestionsWithRetry = useCallback(async (maxRetries = 10, isAdditionalFetch = false) => {
    // Only skip fetching for initial load, not for endless mode additional fetches
    if (questions.length > 0 && !isAdditionalFetch) {
      console.log("Questions already loaded, skipping initial fetch");
      return [];
    }
    
    let attempt = 0;
    let success = false;
    let fetchedQuestions = [];
    
    // Reset the stop flag when starting a new fetch for initial load
    if (!isAdditionalFetch) {
      shouldStopRetrying.current = false;
    }
    
    while (!success && attempt < maxRetries && !shouldStopRetrying.current) {
      try {
        attempt++;
        if (!isAdditionalFetch) {
          setRetryCount(attempt);
        }
        
        const urlCategory = queryParams.get("category");
        const categoryToUse = urlCategory || question_category;
        
        // For additional fetch in endless mode, always get 10 more
        const amountToFetch = isAdditionalFetch ? 10 : amount_of_question;
        
        let apiUrl = `https://opentdb.com/api.php?amount=${amountToFetch}`;
        if (categoryToUse) apiUrl += `&category=${categoryToUse}`;
        if (question_difficulty) apiUrl += `&difficulty=${question_difficulty}`;
        if (question_type) apiUrl += `&type=${question_type}`;
        
        console.log(`${isAdditionalFetch ? "Endless mode" : "Attempt " + attempt}: Fetching questions with URL:`, apiUrl);
        
        const response = await axios.get(apiUrl);
        
        // Check for valid response structure
        if (response.data && response.data.response_code !== undefined) {
          // OpenTrivia API uses response_code to indicate status
          if (response.data.response_code === 0 && 
              response.data.results && 
              response.data.results.length > 0) {
              
            console.log(`Success! Received ${response.data.results.length} questions`);
            fetchedQuestions = response.data.results;
            
            if (!isAdditionalFetch) {
              setQuestions(fetchedQuestions);
              setTimerStarted(true);
              shouldStopRetrying.current = true;
            }
            
            success = true;
            break;
          } else {
            console.log(`API returned response code ${response.data.response_code}, retrying...`);
          }
        } else {
          console.log("Received malformed API response, retrying...");
        }
      } catch (err) {
        console.log(`${isAdditionalFetch ? "Endless mode" : "Attempt " + attempt} failed with error: ${err.message}, retrying in 1 second...`);
        
        if (shouldStopRetrying.current) {
          break;
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    if (!isAdditionalFetch) {
      setLoading(false);
    }
    
    return fetchedQuestions;
  }, [amount_of_question, question_category, question_difficulty, question_type, queryParams]);

  
  // Cleanup function to stop retries when unmounting
  useEffect(() => {
    return () => {
      // Set flag to stop retries when component unmounts
      shouldStopRetrying.current = true;
    };
  }, []);
  
  // Start fetching on component mount
  useEffect(() => {
    if (questions.length === 0) {
      fetchQuestionsWithRetry();
    }
  }, [fetchQuestionsWithRetry]);

  // build and shuffle options when questionIndex or questions change
  useEffect(() => {
    if (!questions.length || !questions[questionIndex]) return;

    if (!allOptions[questionIndex]) {
      const q = questions[questionIndex];
      const answers = [...q.incorrect_answers];
      answers.splice(getRandomInt(answers.length + 1), 0, q.correct_answer);

      const newAllOptions = [...allOptions];
      newAllOptions[questionIndex] = answers;
      setAllOptions(newAllOptions);

      setOptions(answers);
    } else {
      setOptions(allOptions[questionIndex]);
    }
  }, [questions, questionIndex, allOptions]);
  
  // Timer effect - only runs in blitz mode
  useEffect(() => {
    console.log("Timer effect running. isBlitz:", isBlitz, "timer:", timer, "isGameOver:", isGameOver, 
                "questions.length:", questions.length, "timerStarted:", timerStarted);
                
    // Only activate timer if in blitz mode and questions have loaded
    if (isBlitz && timer > 0 && !isGameOver && questions.length > 0) {
      console.log("Starting timer countdown");
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else if (isBlitz && timer === 0 && !isGameOver && questions.length > 0) {
      console.log("Timer reached zero, ending game");
      // Trigger game over
      setIsGameOver(true);
      // Navigate to score with a state indicator that we came from questions
      navigate("/score", { state: { fromQuestions: true } });
    }
  }, [timer, isGameOver, isBlitz, questions.length, timerStarted, navigate]);
  
  // stores selected radio button value
  const handleValueChange = (value) => {
    // Start timer when user first interacts with the quiz
    if (!timerStarted) {
      setTimerStarted(true);
    }
    
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[questionIndex] = value;
    setSelectedAnswers(updatedAnswers);
  };

  // submits answer & moves to next question
  const handleNext = async () => {
    if (!questions[questionIndex]) {
      console.error("No question found at index:", questionIndex);
      return;
    }

    const correct = decode(questions[questionIndex].correct_answer);
    const selected = selectedAnswers[questionIndex];

    // Only score if not already scored
    if (!scoredQuestions.includes(questionIndex)) {
      const isCorrect = selected === correct;
      setAnswerResults((prev) => {
        const updated = [...prev];
        updated[questionIndex] = isCorrect;
        return updated;
      });

      if (isCorrect) {
        dispatch(handleScoreChange(score + 1));
      } else if ((isEndless || isStrike) && lives > 0) {
        // Deduct a life if the answer is wrong in endless or strike mode
        setLives((prevLives) => {
          const newLives = prevLives - 1;
          if (newLives <= 0) {
            // Trigger finish if no lives are left after a short delay
            // to allow state updates to complete
            setTimeout(() => handleFinish(), 100);
          }
          return newLives;
        });
      }

      setScoredQuestions([...scoredQuestions, questionIndex]);
    }

    // Logic for different modes
    if (isEndless) {
      // Check if we need more questions
      if (questionIndex + 1 >= questions.length) {
        console.log("Reached end of questions, fetching more...");
        const newQuestions = await fetchMoreQuestions();
        if (newQuestions && newQuestions.length > 0) {
          console.log("Adding", newQuestions.length, "new questions");
          setQuestions((prev) => [...prev, ...newQuestions]);
        } else {
          console.log("Failed to fetch more questions, ending game");
          handleFinish();
          return;
        }
      }
      
      // Only advance if we have lives left
      if (lives > 0) {
        setQuestionIndex((idx) => idx + 1);
      } else {
        handleFinish();
      }
    } else if (isStrike) {
      // In strike mode, only advance if answer is correct
      if (selected === correct) {
        if (questionIndex + 1 < questions.length) {
          setQuestionIndex((idx) => idx + 1);
        } else {
          // Last question answered correctly
          handleFinish();
        }
      } else {
        // Wrong answer in strike mode
        if (lives <= 0) {
          handleFinish();
        }
      }
    } else {
      // Normal or blitz mode
      if (questionIndex + 1 < questions.length) {
        setQuestionIndex((idx) => idx + 1);
      } else {
        // End of questions
        navigate("/score", { state: { fromQuestions: true } });
      }
    }
  };


  const fetchMoreQuestions = async () => {
    console.log("Fetching more questions for endless mode");
    return await fetchQuestionsWithRetry(5, true); // 5 retries max, and flag as additional fetch
  };

  const handlePrev = () => {
    if (questionIndex > 0) {
      setQuestionIndex((idx) => idx - 1);
    }
  };
  
  // Manual retry button handler
  const handleManualRetry = () => {
    setLoading(true);
    setRetryCount(0);
    setQuestions([]);
    fetchQuestionsWithRetry();
  };

  if (loading)
    return (
      <div className="flex flex-col space-y-4 justify-center items-center w-full h-[100vh] text-center">
        <div className="w-18 h-18 border-8 border-t-8 border-gray-300 border-t-primary rounded-full animate-spin"></div>
        <h3 className="ml-2">Loading questions...</h3>
      </div>
    );
    
  if (!questions.length)
    return (
      <div className="flex flex-col space-y-4 justify-center items-center w-full h-[100vh] text-center text-red-500">
        <p className="text-gray-600 mb-4">The API might be experiencing issues.</p>
        <Button onClick={handleManualRetry}>Try Again</Button>
        <Button onClick={() => navigate("/")}>Back to Home</Button>
      </div>
    );

  return (
    <div className="w-[100vw] md:h-[100vh] flex flex-col md:flex-row gap-0">
      {/* LEFT COLUMN - QUESTION*/}
      <div className="flex-1 h-full flex flex-col justify-between px-4 py-8 md:px-8 md:py-12 xl:px-24 xl:py-20 rounded-bl-2xl rounded-br-2xl md:rounded-tr-2xl md:rounded-bl-none overflow-hidden relative" 
      style={{
        backgroundImage: `radial-gradient(circle at center, rgba(60, 57, 199, 0.9) 0%, rgba(60, 57, 199, 0.95) 100%), url(${blitzPng})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
        <Link to="/">
          <Button variant="link" className="text-off-white" ><ArrowLeft strokeWidth={2}/> Exit to Home</Button>
        </Link>

        <div className="text-white space-y-4">
          {/* QUESTION NUMBER */}
          <h3 className="text-off-white/75 font-medium">
            {isBlitz && (
              <div className="text-xl font-bold bg-white text-primary rounded-full px-4 py-1 mb-2">
                ⏱ {timer}
              </div>
            )}
            {/* LIVES */}
            {isEndless && (
              <div className="flex items-center space-x-1">
                {Array.from({ length: 3 }).map((_, index) => (
                  index < lives ? (
                    <Heart key={index} fill="red" className="text-red-500 w-6 h-6" />
                  ) : (
                    <HeartCrack key={index} className="text-red-500 w-6 h-6" />
                  )
                ))}
              </div>
            )}
            Question {questionIndex + 1}/{isEndless ? "∞" : questions.length}
          </h3>

          {/* QUESTION */}
          <h2 className="">
            {decode(questions[questionIndex].question)}
          </h2>

          <p className="text-off-white/75 font-medium">Select One Answer</p>
        </div>

        <div className="text-off-white">
          <h4 className="font-bold">{mode.charAt(0).toUpperCase() + mode.slice(1)} Mode</h4>
        </div>
      
      </div>

      {/* RIGHT COLUMN - OPTIONS & NAV*/}
      <div className="flex-1 h-full w-full flex flex-col justify-between space-y-4 items-center px-4 py-8 md:px-2 md:py-12 xl:px-24 xl:py-20 overflow-hidden">

        {/* THINKING AVATAR */}
        <img src={thinkingAvatar} alt="" className="w-[30%] h-auto"/>

        {/* RADIO BUTTONS OPTIONS */}
        <RadioGroup
          value={selectedOption}
          onValueChange={handleValueChange}
          className="space-y-2 w-full md:w-[80%]"
        >
          {options.map((opt, i) => {
            const decoded = decode(opt);
            const id = `option-${questionIndex}-${i}`;
            const isCorrectAnswer =
              decoded === decode(questions[questionIndex].correct_answer);
            const isSelected = decoded === selectedOption;
            const isScored = scoredQuestions.includes(questionIndex);

            let extraInfo = "";
            let extraClass = "";

            if (isScored) {
              if (isCorrectAnswer) {
                extraInfo = "✅ Correct";
                extraClass = "text-green-600 font-semibold";
              } else if (isSelected) {
                extraInfo = "❌ Your Answer";
                extraClass = "text-red-600 font-medium";
              }
            }

            return (
              <label
                key={i}
                htmlFor={id}
                className={`flex items-center space-x-2 border-primary border-3 rounded-full px-2 py-2 w-full cursor-pointer ${
                  isScored ? "opacity-80" : ""
                }`}
              >
                <RadioGroupItem
                  value={decoded}
                  id={id}
                  disabled={isScored}
                />
                <Label
                  htmlFor={id}
                  className={`${extraClass} text-sm md:text-md lg:text-lg text-primary font-bold`}
                >
                  {decoded}
                  {extraInfo && <span>{extraInfo}</span>}
                </Label>
              </label>
            );
          })}
        </RadioGroup>
          
        {/* NEXT & PREV BUTTONS */}
        <div className="flex flex-row justify-center items-center space-x-2">
          {/* prev */}
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={questionIndex === 0}
          >
          <ArrowLeft strokeWidth={2}/>  Previous
          </Button>

          {/* next */}
          <Button
            onClick={handleNext}
            disabled={!selectedOption}
          >
            {isEndless ? "Next" : questionIndex + 1 === questions.length ? "Finish" : "Next"} <ArrowRight strokeWidth={2}/>
          </Button>
        </div>
      </div>

    </div>
  );
  
};

export default Questions;
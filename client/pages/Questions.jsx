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

  // FIX: Use specific selectors instead of selecting the entire state
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
  const [timerStarted, setTimerStarted] = useState(false);

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
  
  // Brute force fetch with retries regardless of errors - EXACT from SimpleQuestions
  const fetchQuestionsWithRetry = useCallback(async (maxRetries = 10) => {
    let attempt = 0;
    let success = false;
    
    // Reset the stop flag when starting a new fetch
    shouldStopRetrying.current = false;
    
    while (!success && attempt < maxRetries && !shouldStopRetrying.current) {
      try {
        attempt++;
        setRetryCount(attempt);
        
        // Build API URL with Redux state
        let apiUrl = `https://opentdb.com/api.php?amount=${amount_of_question}`;
        if (question_category) apiUrl += `&category=${question_category}`;
        if (question_difficulty) apiUrl += `&difficulty=${question_difficulty}`;
        if (question_type) apiUrl += `&type=${question_type}`;
        
        const response = await axios.get(apiUrl);
        
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
  }, [amount_of_question, question_category, question_difficulty, question_type]);
  
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
    // Only activate timer if in blitz mode and questions have loaded
    if (isBlitz && timer > 0 && !isGameOver && questions.length > 0 && timerStarted) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else if (isBlitz && timer === 0 && !isGameOver && questions.length > 0 && timerStarted) {
      // Only trigger game over if timer has been started
      setIsGameOver(true);
      // Navigate to score with a state indicator that we came from questions
      navigate("/score", { state: { fromQuestions: true } });
    }
  }, [timer, isGameOver, isBlitz, questions.length, timerStarted, navigate]);
  
  // stores selected radio button value
  const handleValueChange = (value) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[questionIndex] = value;
    setSelectedAnswers(updatedAnswers);
  };

  // submits answer & moves to next question
  const handleNext = async () => {
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
      } else if (isEndless || isStrike) {
        // Deduct a life if the answer is wrong in endless or strike mode
        setLives((prevLives) => {
          const newLives = prevLives - 1;
          if (newLives <= 0) {
            // Trigger finish if no lives are left
            handleFinish();
          }
          return newLives;
        });
      }

      setScoredQuestions([...scoredQuestions, questionIndex]);
    }

    // Check if in endless mode
    if (isEndless) {
      if (questionIndex + 1 === questions.length) {
        // Fetch more questions and append them
        const newQuestions = await fetchMoreQuestions();
        setQuestions((prev) => [...prev, ...newQuestions]);
      }
      setQuestionIndex((idx) => idx + 1);
    } else if (isStrike) {
      // Advance to the next question in strike mode if the answer is correct
      if (selected === correct && questionIndex + 1 < questions.length) {
        setQuestionIndex((idx) => idx + 1);
      } else if (selected === correct && questionIndex + 1 === questions.length) {
        // If it's the last question, finish the quiz
        handleFinish();
      }
    } else {
      // Navigate forward for normal or blitz mode
      if (questionIndex + 1 < questions.length) {
        setQuestionIndex((idx) => idx + 1);
      } else {
        // Navigate to score with a state indicator that we came from questions
        navigate("/score", { state: { fromQuestions: true } });
      }
    }
  };

  const fetchMoreQuestions = async () => {
    try {
      let apiUrl = `https://opentdb.com/api.php?amount=10`; // Fetch 10 more questions
      if (question_category) apiUrl += `&category=${question_category}`;
      if (question_difficulty) apiUrl += `&difficulty=${question_difficulty}`;
      if (question_type) apiUrl += `&type=${question_type}`;

      const response = await axios.get(apiUrl);
      if (response.data.results && response.data.results.length > 0) {
        return response.data.results;
      }
    } catch (err) {
      console.error("Failed to fetch more questions:", err);
    }
    return [];
  };

  const handlePrev = () => {
    if (questionIndex > 0) {
      setQuestionIndex((idx) => idx - 1);
      
      // No longer reset timer when going to previous question
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
                    <Heart key={index} className="text-red-500 w-6 h-6" />
                  ) : (
                    <HeartOff key={index} className="text-gray-400 w-6 h-6" />
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
              <div
                key={i}
                className={`flex items-center space-x-2 border-primary border-3 rounded-full px-2 py-2 w-full ${
                  isScored ? "opacity-80" : ""
                }`}
              >
                <RadioGroupItem
                  value={decoded}
                  id={id}
                  disabled={isScored}
                />
                <Label htmlFor={id} className={`${extraClass} text-sm md:text-md lg:text-lg text-primary font-bold `}>
                  {decoded}
                  {extraInfo && (
                    <span>{extraInfo}</span>
                  )}
                </Label>
              </div>
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
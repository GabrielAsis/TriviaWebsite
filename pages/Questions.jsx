import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { handleScoreChange } from "../redux/actions";
import { decode } from "html-entities";
import axios from "axios";
import { Link } from 'react-router-dom'
import gsap from 'gsap';

// shadcn imports
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import toast from 'react-hot-toast'; 

// assets imports
import { 
  thinkingAvatar1, 
  thinkingAvatar2, 
  thinkingAvatar3, 
  thinkingAvatar4, 
  thinkingAvatar5, 
  thinkingAvatar6, 
  thinkingAvatar7, 
  thinkingAvatar8, 
  thinkingAvatar9, 
} from "../src/assets";

// icon imports
import { ArrowLeft, ArrowRight, Heart, HeartCrack, HeartOff, Check, X } from "lucide-react";  

const getRandomInt = (max) =>
  Math.floor(Math.random() * Math.floor(max));

// Thinking avatars
const thinkingAvatars = [
  thinkingAvatar1,
  thinkingAvatar2,
  thinkingAvatar3,
  thinkingAvatar4,
  thinkingAvatar5,
  thinkingAvatar6,
  thinkingAvatar7,
  thinkingAvatar8,
  thinkingAvatar9
];

const getRandomAvatar = () => thinkingAvatars[getRandomInt(thinkingAvatars.length)];

const Questions = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode") || "normal"; // fallback
  
  const timerParam = queryParams.get("timer");
  const defaultTimer = timerParam ? parseInt(timerParam) : 60;

  const isBlitz = mode === "blitz";
  const isEndless = mode === "endless";
  const isStrike = mode === "strike";

  const question_category = useSelector((state) => state.question_category);
  const question_difficulty = useSelector((state) => state.question_difficulty);
  const question_type = useSelector((state) => state.question_type);
  const amount_of_question = useSelector((state) => state.amount_of_question);
  const score = useSelector((state) => state.score);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const questionContainerRef = useRef(null);
  const optionsContainerRef = useRef(null);
  const avatarRef = useRef(null);
  const optionRefs = useRef({});

  const [allOptions, setAllOptions] = useState([]);

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [scoredQuestions, setScoredQuestions] = useState([]);
  const [answerResults, setAnswerResults] = useState([]);
  
  const [currentAvatar, setCurrentAvatar] = useState(() => getRandomAvatar());
  
  const [timer, setTimer] = useState(isBlitz ? defaultTimer : 0);
  const [isGameOver, setIsGameOver] = useState(false);
  
  const timerStartedParam = queryParams.get("timerStarted");
  const [timerStarted, setTimerStarted] = useState(timerStartedParam === "true" || true);

  const shouldStopRetrying = useRef(false);

  const [lives, setLives] = useState(isEndless ? 3 : isStrike ? 1 : null);

  const [isAnimating, setIsAnimating] = useState(false);

  const [reviewingAnswer, setReviewingAnswer] = useState(false);

  const animateQuestionTransitionOut = useCallback(() => {
    setIsAnimating(true);
    
    const tl = gsap.timeline({
      onComplete: () => {
        setIsAnimating(false);
        setCurrentAvatar(getRandomAvatar());
      }
    });
    
    tl.to(questionContainerRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.4,
      ease: "power2.out"
    }, 0);
    
    tl.to(optionsContainerRef.current, {
      opacity: 0,
      y: -20, 
      duration: 0.4,
      ease: "power2.out"
    }, 0.1);
    
    tl.to(avatarRef.current, {
      opacity: 0,
      scale: 0.95,
      duration: 0.3,
      ease: "power2.out"
    }, 0);
    
    return tl;
  }, []);

  const animateQuestionTransitionIn = useCallback(() => {
    gsap.set([questionContainerRef.current, optionsContainerRef.current], {
      opacity: 0,
      y: 20
    });
    
    gsap.set(avatarRef.current, {
      opacity: 0,
      scale: 0.95
    });
    
    const tl = gsap.timeline();
    
    tl.to(questionContainerRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power2.out"
    }, 0);
    
    tl.to(optionsContainerRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power2.out"
    }, 0.1);
    
    tl.to(avatarRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: "power2.out"
    }, 0.05);
    
    return tl;
  }, []);

  const animateIncorrectAnswer = useCallback((optionElement) => {
    if (!optionElement) return;
    
    gsap.to(optionElement, {
        keyframes: {
        rotation: [6,-5, 3,-2, 0]
      },
      duration: 1,
      ease: "power2.out",
    });
  }, []);

  const animateCorrectAnswer = useCallback((optionElement) => {
    if (!optionElement) return;
    
    const tl = gsap.timeline();
    
    tl.to(optionElement, {
      y: -10,
      scale: 1.05,
      duration: 0.2,
      ease: "power2.out"
    });
    
    tl.to(optionElement, {
      y: 0,
      scale: 1,
      duration: 0.7,
      ease: "elastic.out(1.2, 0.5)" 
    });
    
    return tl;
  }, []);

  useEffect(() => {
    dispatch(handleScoreChange(0));
    
    if (questions.length > 0 && !loading) {
      animateQuestionTransitionIn();
    }
  }, [dispatch, questions, loading, animateQuestionTransitionIn]);
  
  const selectedOption = selectedAnswers[questionIndex] || "";
  
  // Functions to rety fetching questions
  const fetchQuestionsWithRetry = useCallback(async (maxRetries = 10, isAdditionalFetch = false) => {
    if (questions.length > 0 && !isAdditionalFetch) {
      console.log("Questions already loaded, skipping initial fetch");
      return [];
    }
    
    let attempt = 0;
    let success = false;
    let fetchedQuestions = [];
    
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
        
        const amountToFetch = isAdditionalFetch ? 10 : amount_of_question;
        
        let apiUrl = `https://opentdb.com/api.php?amount=${amountToFetch}`;
        if (categoryToUse) apiUrl += `&category=${categoryToUse}`;
        if (question_difficulty) apiUrl += `&difficulty=${question_difficulty}`;
        if (question_type) apiUrl += `&type=${question_type}`;
        
        console.log(`${isAdditionalFetch ? "Endless mode" : "Attempt " + attempt}: Fetching questions with URL:`, apiUrl);
        
        const response = await axios.get(apiUrl);
        
        if (response.data && response.data.response_code !== undefined) {
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
  }, [amount_of_question, question_category, question_difficulty, question_type, queryParams, questions.length]);

  
  useEffect(() => {
    return () => {
      shouldStopRetrying.current = true;
    };
  }, []);
  
  // Start fetching questions
  useEffect(() => {
    if (questions.length === 0) {
      fetchQuestionsWithRetry();
    }
  }, [fetchQuestionsWithRetry, questions.length]);

  // Option randomizer
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
    
    if (!loading && questions.length > 0) {
      animateQuestionTransitionIn();
    }
  }, [questions, questionIndex, allOptions, loading, animateQuestionTransitionIn]);
  
  // Timer effect
  useEffect(() => {
    console.log("Timer effect running. isBlitz:", isBlitz, "timer:", timer, "isGameOver:", isGameOver, 
                "questions.length:", questions.length, "timerStarted:", timerStarted);
                
    if (isBlitz && timer > 0 && !isGameOver && questions.length > 0) {
      console.log("Starting timer countdown");
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else if (isBlitz && timer === 0 && !isGameOver && questions.length > 0) {
      console.log("Timer reached zero, ending game");
      setIsGameOver(true);
      
      const tl = animateQuestionTransitionOut();
      tl.then(() => {
        navigate("/score", { state: { fromQuestions: true } });
      });
    }
  }, [timer, isGameOver, isBlitz, questions.length, timerStarted, navigate, animateQuestionTransitionOut]);
  
  // Stores selected optoins
  const handleValueChange = (value) => {
    if (!timerStarted) {
      setTimerStarted(true);
    }
    
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[questionIndex] = value;
    setSelectedAnswers(updatedAnswers);
  };

  // Check answer
  const handleNext = async () => {
    if (isAnimating) return;
    
    if (!questions[questionIndex]) {
      console.error("No question found at index:", questionIndex);
      return;
    }

    if (reviewingAnswer) {
      handleContinueAfterReview();
      return;
    }

    const correct = decode(questions[questionIndex].correct_answer);
    const selected = selectedAnswers[questionIndex];

    if (!scoredQuestions.includes(questionIndex)) {
      const isCorrect = selected === correct;
      setAnswerResults((prev) => {
        const updated = [...prev];
        updated[questionIndex] = isCorrect;
        return updated;
      });

      const selectedIndex = options.findIndex(opt => decode(opt) === selected);
      const correctIndex = options.findIndex(opt => decode(opt) === correct);
      
      const selectedElement = optionRefs.current[selectedIndex];
      const correctElement = optionRefs.current[correctIndex];
      
      if (isCorrect) {
        animateCorrectAnswer(selectedElement);
        dispatch(handleScoreChange(score + 1));
        toast.success("Correct! Well done!");
      } else {
        animateIncorrectAnswer(selectedElement);
        setTimeout(() => {
          animateCorrectAnswer(correctElement);
        }, 600);
        
        toast.error(`Incorrect Answer 🥀`);
        
        if ((isEndless || isStrike) && lives > 0) {
          setLives((prevLives) => {
            const newLives = prevLives - 1;
            return newLives;
          });
        }
      }

      setScoredQuestions([...scoredQuestions, questionIndex]);
      
      setReviewingAnswer(true);
    }
  };

  //Move to next question after checking answer
  const handleContinueAfterReview = async () => {
    if (isAnimating) return;
    
    const tl = animateQuestionTransitionOut();
    
    tl.then(async () => {
      setReviewingAnswer(false);
      
      if (isEndless) {
        if (questionIndex + 1 >= questions.length) {
          console.log("Reached end of questions, fetching more...");
          const newQuestions = await fetchMoreQuestions();
          if (newQuestions && newQuestions.length > 0) {
            console.log("Adding", newQuestions.length, "new questions");
            setQuestions((prev) => [...prev, ...newQuestions]);
          } else {
            console.log("Failed to fetch more questions, ending game");
            navigate("/score", { state: { fromQuestions: true } });
            return;
          }
        }
        
        // Only advance if we have lives left
        if (lives > 0) {
          setQuestionIndex((idx) => idx + 1);
        } else {
          navigate("/score", { state: { fromQuestions: true } });
        }
      } else if (isStrike) {
        const correct = decode(questions[questionIndex].correct_answer);
        const selected = selectedAnswers[questionIndex];
        
        // In strike mode, only advance if answer is correct
        if (selected === correct) {
          if (questionIndex + 1 < questions.length) {
            setQuestionIndex((idx) => idx + 1);
          } else {
            // Last question answered correctly
            navigate("/score", { state: { fromQuestions: true } });
          }
        } else {
          // Wrong answer in strike mode
          if (lives <= 0) {
            navigate("/score", { state: { fromQuestions: true } });
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
    });
  };

  // Fetching more questions for endless mode
  const fetchMoreQuestions = async () => {
    console.log("Fetching more questions for endless mode");
    return await fetchQuestionsWithRetry(5, true);
  };

  // Move to previous question
  const handlePrev = () => {
    if (isAnimating) return;
    
    if (questionIndex > 0) {
      const tl = animateQuestionTransitionOut();
      tl.then(() => {
        setQuestionIndex((idx) => idx - 1);
      });
    }
  };
  
  // Function to retry fetching questions manually
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
  
  // If no questions fetched
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
      <div className="bg-gradient-to-br from-primary to-[#8F5BFF] flex-1 h-full flex flex-col justify-between px-4 py-8 md:px-8 md:py-12 xl:px-24 xl:py-20 rounded-bl-2xl rounded-br-2xl md:rounded-tr-2xl md:rounded-bl-none overflow-hidden relative">
        <Link to="/">
          <Button variant="link" className="text-off-white" ><ArrowLeft strokeWidth={2}/> Exit to Home</Button>
        </Link>

        <div ref={questionContainerRef} className="text-white space-y-4">
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
        </div>

        <div className="text-off-white">
          <h4 className="font-bold">{mode.charAt(0).toUpperCase() + mode.slice(1)} Mode</h4>
        </div>
      
      </div>

      {/* RIGHT COLUMN - OPTIONS & NAV*/}
      <div className="flex-1 h-full w-full flex flex-col justify-between space-y-4 items-center px-4 py-8 md:px-2 md:py-12 xl:px-24 xl:py-20 overflow-hidden">

        <img ref={avatarRef} src={currentAvatar} alt="" className="w-auto h-[40%]"/>

        {/* RADIO BUTTONS OPTIONS */}
        <RadioGroup
          ref={optionsContainerRef}
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

            if (isScored && reviewingAnswer) {
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
                ref={(el) => optionRefs.current[i] = el}
                className={`flex items-center space-x-2 border-primary border-3 rounded-full px-2 py-2 w-full cursor-pointer ${
                  isScored && reviewingAnswer ? "opacity-80" : ""
                } ${
                  reviewingAnswer && isCorrectAnswer ? "bg-green-100/50" : ""
                } ${
                  reviewingAnswer && isSelected && !isCorrectAnswer ? "bg-red-100/50" : ""
                }`}
              >
                <RadioGroupItem
                  value={decoded}
                  id={id}
                  disabled={reviewingAnswer}
                />
                <Label
                  htmlFor={id}
                  className={`${extraClass} text-sm md:text-md lg:text-lg text-primary font-bold`}
                >
                  {decoded}
                  {extraInfo && <span className="ml-2">{extraInfo}</span>}
                </Label>
              </label>
            );
          })}
        </RadioGroup>
          
        {/* NEXT & PREV BUTTONS */}
        <div className="flex flex-row justify-center items-center space-x-2">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={questionIndex === 0 || reviewingAnswer || isAnimating}
          >
          <ArrowLeft strokeWidth={2}/>  Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={!selectedOption || isAnimating}
          >
            {(selectedAnswers[questionIndex] && !scoredQuestions.includes(questionIndex))
              ? "Check Answer"
              : isEndless 
                ? "Next" 
                : questionIndex + 1 === questions.length 
                  ? "Finish" 
                  : "Next"} 
            <ArrowRight strokeWidth={2}/>
          </Button>
        </div>
      </div>

    </div>
  );
  
};

export default Questions;
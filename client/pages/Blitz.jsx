import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
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
import { ArrowLeft, ArrowRight } from "lucide-react";  

// number randomizer
const getRandomInt = (max) =>
  Math.floor(Math.random() * Math.floor(max));

const Blitz = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode") || "normal"; // fallback

  const isBlitz = mode === "blitz";
  const isEndless = mode === "endless";
  const isCustom = mode === "custom";

  console.log("Current mode:", mode);

  // hide/show nav
  useEffect(() => {
    const navbar = document.getElementById("navbar");
    if (navbar) navbar.style.display = "none";
    return () => {
      if (navbar) navbar.style.display = "block";
    };
  }, []);

  const {
    question_category,
    question_difficulty,
    question_type,
    amount_of_question,
    score,
  } = useSelector((state) => state);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // USE STATES
  const [questions, setQuestions] = useState([]);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const selectedOption = selectedAnswers[questionIndex] || "";
  const isAnswered = selectedAnswers.length > questionIndex;
  const [scoredQuestions, setScoredQuestions] = useState([]);
  const [answerResults, setAnswerResults] = useState([]);
  
  const [timer, setTimer] = useState(10); 
  const [isGameOver, setIsGameOver] = useState(false);

  
  // fetch token + questions
  useEffect(() => {
    const fetchTokenAndQuestions = async () => {
      try {
        const { data: tokenRes } = await axios.get(
          "https://opentdb.com/api_token.php?command=request",
          { withCredentials: false }
        );
        setToken(tokenRes.token);

        let apiUrl = `https://opentdb.com/api.php?amount=${amount_of_question}&token=${tokenRes.token}`;
        if (question_category) apiUrl += `&category=${question_category}`;
        if (question_difficulty) apiUrl += `&difficulty=${question_difficulty}`;
        if (question_type) apiUrl += `&type=${question_type}`;

        const { data: questionRes } = await axios.get(apiUrl, {
          withCredentials: false,
        });
        setQuestions(questionRes.results);
      } catch (err) {
        console.error("Failed to fetch token or questions", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTokenAndQuestions();
  }, [
    amount_of_question,
    question_category,
    question_difficulty,
    question_type,
  ]);

  // build and shuffle options when questionIndex or questions change
  useEffect(() => {
    if (!questions.length || !questions[questionIndex]) return;
  
    const q = questions[questionIndex];
    const answers = [...q.incorrect_answers];
    answers.splice(getRandomInt(answers.length + 1), 0, q.correct_answer);
  
    setOptions(answers);
  }, [questions, questionIndex]);
  
  // stores selected radio button value
  const handleValueChange = (value) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[questionIndex] = value;
    setSelectedAnswers(updatedAnswers);
  };

  // submits answer & moves to next question
  const handleNext = () => {
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
  
    // Navigate forward
    if (questionIndex + 1 < questions.length) {
      setQuestionIndex((idx) => idx + 1);
    } else {
      navigate("/score");
    }
  };

  const handleFinish = () => {
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
  
    navigate("/score");
  };

  const handlePrev = () => {
    if (questionIndex > 0) {
      setQuestionIndex((idx) => idx - 1);
    }
  };

  // handle timer
  // useEffect(() => {
  //   if (timer > 0 && !isGameOver) {
  //     const interval = setInterval(() => {
  //       setTimer((prev) => prev - 1);
  //     }, 1000);

  //     return () => clearInterval(interval);
  //   } else if (timer === 0 && !isGameOver) {
  //     setIsGameOver(true);
  //     handleFinish(); // Auto-finish on timer end
  //   }
  // }, [timer, isGameOver]);

  if (timer === 0 && !isGameOver) {
    setIsGameOver(true);
    setTimeout(handleFinish, 100); // short delay to ensure all state is updated
  }  

  if (loading)
    return (
      <div className="flex flex-col space-y-4 justify-center items-center w-full h-[100vh] text-center">
        <div className="w-18 h-18 border-8 border-t-8 border-gray-300 border-t-primary rounded-full animate-spin"></div>
        <h3 className="ml-2">Loading Questions...</h3>
      </div>
    );
  if (!questions.length)
    return (
      <div className="flex flex-col space-y-4 justify-center items-center w-full h-[100vh] text-center text-red-500">
        <h3>There seems to be a problem, please try again later. 😥</h3>
      </div>
    );

  return (
    <div className="w-[100vw] h-[100vh] grid grid-cols-2 gap-0">
      
      {/* LEFT COLUMN - QUESTION*/}
      <div className="h-full flex flex-col justify-between px-24 py-20 rounded-br-2xl rounded-tr-2xl overflow-hidden relative" 
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
          <div className="text-xl font-bold bg-white text-primary rounded-full px-4 py-1">
            ⏱ {timer}
          </div>
            Question {questionIndex + 1}/{questions.length}
          </h3>

          {/* QUESTION */}
          <h2 className="">
            {decode(questions[questionIndex].question)}
          </h2>

          <p className="text-off-white/75 font-medium">Select One Answer</p>
        </div>

        <div className="text-off-white">
          <h4 className="font-bold">Blitz Mode</h4>
        </div>
      
      </div>

      {/* RIGHT COLUMN - OPTIONS & NAV*/}
      <div className="h-full w-full flex flex-col justify-between space-y-4 items-center px-24 py-20 overflow-hidden">

        {/* THINKING AVATAR */}
        <img src={thinkingAvatar} alt="" className="w-[30%] h-auto"/>

        {/* RADIO BUTTONS OPTIONS */}
        <RadioGroup
          value={selectedOption}
          onValueChange={handleValueChange}
          className="space-y-2 w-[80%]"
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
                <Label htmlFor={id} className={`${extraClass} text-lg text-primary font-bold `}>
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
           {questionIndex + 1 === questions.length ? "Finish" : "Next"} <ArrowRight strokeWidth={2}/>
          </Button>
        </div>

        {/* SCORE */}
        {/* <div className="mt-6 text-sm text-gray-600">
          Score: {score} / {questions.length}
        </div> */}  
      </div>

    </div>
  );
  
};

export default Blitz;

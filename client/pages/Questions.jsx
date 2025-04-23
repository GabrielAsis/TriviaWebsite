import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleScoreChange } from "../redux/actions";
import { decode } from "html-entities";
import axios from "axios";

// your Shadcn imports
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const getRandomInt = (max) =>
  Math.floor(Math.random() * Math.floor(max));

const Questions = () => {
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

  const [questions, setQuestions] = useState([]);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const selectedOption = selectedAnswers[questionIndex] || "";
  const isAnswered = selectedAnswers.length > questionIndex;
  const [scoredQuestions, setScoredQuestions] = useState([]);


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
    if (!questions.length) return;
  
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
  
    // If it's correct AND hasn't been scored yet
    if (selected === correct && !scoredQuestions.includes(questionIndex)) {
      dispatch(handleScoreChange(score + 1));
      setScoredQuestions([...scoredQuestions, questionIndex]);
    }
  
    if (questionIndex + 1 < questions.length) {
      setQuestionIndex((idx) => idx + 1);
    } else {
      navigate("/score");
    }
  };

  const handlePrev = () => {
    if (questionIndex > 0) {
      setQuestionIndex((idx) => idx - 1);
    }
  };

  if (loading)
    return (
      <div className="mt-20 text-center">Loading Questions…</div>
    );
  if (!questions.length)
    return (
      <div className="mt-20 text-center text-red-500">
        No questions available.
      </div>
    );

  return (
    <div className="max-w-xl mx-auto mt-10">
      {/* QUESTION NUMBER */}
      <h2 className="text-xl font-bold">
        Question {questionIndex + 1} / {questions.length}
      </h2>

      {/* QUESTION */}
      <p className="mt-4 text-lg">
        {decode(questions[questionIndex].question)}
      </p>

      {/* RADIO BUTTONS OPTIONS */}
      <RadioGroup
        value={selectedOption}
        onValueChange={handleValueChange}
        className="mt-6 space-y-4"
      >
        {options.map((opt, i) => {
          const decoded = decode(opt);
          const id = `option-${questionIndex}-${i}`;
          return (
            <div
              key={i}
              className="flex items-center space-x-2"
            >
              <RadioGroupItem value={decoded} id={id} />
              <Label htmlFor={id}>{decoded}</Label>
            </div>
          );
        })}
      </RadioGroup>
      
      {/* NEXT & PREV BUTTONS */}
      <div className="mt-6 flex justify-between">
        {questionIndex > 0 ? (
          <Button
            variant="outline"
            onClick={handlePrev}
          >
            Previous
          </Button>
        ) : <div />} {/* empty div to preserve layout spacing */}

        <Button
          onClick={handleNext}
          disabled={!selectedAnswers[questionIndex]} // use selectedAnswers now
        >
          {questionIndex + 1 < questions.length ? "Next" : "Finish"}
        </Button>
      </div>

      {/* SCORE */}
      <div className="mt-6 text-sm text-gray-600">
        Score: {score} / {questions.length}
      </div>
    </div>
  );
};

export default Questions;

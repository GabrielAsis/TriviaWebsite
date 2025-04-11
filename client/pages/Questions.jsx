import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleScoreChange } from "../redux/actions";
import { decode } from "html-entities";
import axios from "axios";

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

const Questions = () => {
  const {
    question_category,
    question_difficulty,
    question_type,
    amount_of_question,
    score,
  } = useSelector((state) => state);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [token, setToken] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get session token from OpenTDB
  useEffect(() => {
    const fetchTokenAndQuestions = async () => {
      try {
        const tokenRes = await axios.get("https://opentdb.com/api_token.php?command=request", {
          withCredentials: false
        });
        const sessionToken = tokenRes.data.token;
        setToken(sessionToken);

        let apiUrl = `https://opentdb.com/api.php?amount=${amount_of_question}&token=${sessionToken}`;
        
        if (question_category) apiUrl += `&category=${question_category}`;
        if (question_difficulty) apiUrl += `&difficulty=${question_difficulty}`;
        if (question_type) apiUrl += `&type=${question_type}`;

        const questionRes = await axios.get(apiUrl, {
          withCredentials: false
        });
        setQuestions(questionRes.data.results);
      } catch (err) {
        console.error("Failed to fetch token or questions", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTokenAndQuestions();
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      const question = questions[questionIndex];
      let answers = [...question.incorrect_answers];
      answers.splice(
        getRandomInt(question.incorrect_answers.length + 1),
        0,
        question.correct_answer
      );
      setOptions(answers);
    }
  }, [questions, questionIndex]);

  const handleClickAnswer = (e) => {
    const question = questions[questionIndex];
    if (e.target.textContent === decode(question.correct_answer)) {
      dispatch(handleScoreChange(score + 1));
    }

    if (questionIndex + 1 < questions.length) {
      setQuestionIndex(questionIndex + 1);
    } else {
      navigate("/score");
    }
  };

  if (loading) return <div className="mt-20 text-center">Loading Questions...</div>;
  if (!questions.length) return <div className="mt-20 text-center text-red-500">No questions available.</div>;

  return (
    <div className="text-center">
      <h2 className="text-xl font-bold">Question {questionIndex + 1}</h2>
      <p className="mt-5">{decode(questions[questionIndex].question)}</p>
      {options.map((data, id) => (
        <div key={id} className="mt-3">
          <button
            onClick={handleClickAnswer}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {decode(data)}
          </button>
        </div>
      ))}
      <div className="mt-5">
        Score: {score} / {questions.length}
      </div>
    </div>
  );
};

export default Questions;

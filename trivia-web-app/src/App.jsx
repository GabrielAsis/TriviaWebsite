import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Settings from "../pages/Settings";
import Questions from "../pages/Questions";
import FinalScore from "../pages/FinalScore";

function App() {
  return (
    <Router>
      <div className="max-w-2xl mx-auto text-center mt-10">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <h1 className="text-4xl font-bold mb-5">Trivia App</h1>
                <Settings />
              </>
            }
            exact
          />
          <Route path="/questions" element={<Questions />} />
          <Route path="/score" element={<FinalScore />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import Settings from "../pages/Settings";
import Questions from "../pages/Questions";
import FinalScore from "../pages/FinalScore";
import { Container, Typography } from "@mui/material"
import { Box } from "@mui/material"

function App() {
  return (
    <Router>
      {/* NAV HERE <Header/> */}
      <Container maxWidth="sm">
        <Box textAlign='center' mt={5}>
          <Routes>
            <Route path="/" element={
            <>
              <Typography variant='h2' fontWeight='bold'>Trivia App</Typography>
              <Settings />
            </>
            } exact/>
            <Route path="/questions" element={<Questions />} />
            <Route path="/score" element={<FinalScore />} />
          </Routes>
        </Box>
      </Container>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// import pages
import Settings from "../pages/Settings";
import Questions from "../pages/Questions";
import FinalScore from "../pages/FinalScore";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import { Dashboard } from '../pages/Dashboard';
import Blitz from '../pages/Blitz';
import Endless from '../pages/Endless';

// import components
import NavBar from "./Components/NavBar";

import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { UserContextProvider } from '../context/userContext';

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Router>
        <NavBar />
        <Toaster position='bottom-right' toastOptions={{duration: 2000}}/>
        <Routes>
          <Route path="/" element={<Home />} exact/>
          <Route path="/register" element={<Register />} />

          <Route path="/login" element={<Login />} />

          <Route path="/dashboard" element={<Dashboard />} />
          
          <Route path="/settings" element={<Settings />} />

          <Route path="/questions" element={<Questions />} />

          <Route path="/score" element={<FinalScore />} />
        </Routes>
      </Router>
    </ UserContextProvider>
  );
}

export default App;
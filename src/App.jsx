import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// import pages
import Settings from "../pages/Settings";
import Questions from "../pages/Questions";
import FinalScore from "../pages/FinalScore";
import Home from "../pages/Home";
import { Dashboard } from '../pages/Dashboard';
import Blitz from '../pages/Blitz';
import Endless from '../pages/Endless';
import Categories from '../pages/Categories';
import Leaderboard from '../pages/Leaderboard';
import Modes from '../pages/Modes'

// import components
import NavBar from "./components/NavBar";
import Footer from "./components/Footer"

import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { UserContextProvider } from '../context/userContext';
import { useEffect, useState } from 'react';

import { auth } from "./components/firebase"

// This component wraps the routes and conditionally renders NavBar and Footer
function AppContent() {
  const location = useLocation();
  const [user, setUser] = useState();
  
  // List of paths where NavBar and Footer should be hidden
  const hideNavAndFooterPaths = ['/questions', '/settings'];

    const coloredNavBarPaths = ['/dashboard'];
  
  // Check if the current path is in the list of paths to hide NavBar and Footer
  const shouldHideNavAndFooter = hideNavAndFooterPaths.includes(location.pathname);

  const shouldUseColoredNavBar = coloredNavBarPaths.includes(location.pathname);

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      setUser(user);
    })
  }, [])

  function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);
    return null;
  }
  
  return (
    <>
      <ScrollToTop /> 
      {!shouldHideNavAndFooter  && <NavBar colored={shouldUseColoredNavBar} />}
      <Toaster position='bottom-right' toastOptions={{ duration: 2000 }} />
      <Routes>
        <Route path="/" element={<Home />} exact />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/score" element={<FinalScore />} />
        <Route path="/blitz" element={<Blitz />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/modes" element={<Modes />} />
      </Routes>
      {!shouldHideNavAndFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <UserContextProvider>
      <Router>
        <AppContent />
      </Router>
    </UserContextProvider>
  );
}

export default App;
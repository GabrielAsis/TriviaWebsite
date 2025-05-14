import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom"; // Add useLocation
import { handleAmountChange, handleScoreChange } from "../redux/actions";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/userContext";

// Firebase imports
import { auth, db } from "../src/Components/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const FinalScore = () => {
  const dispatch = useDispatch();
  const { score } = useSelector((state) => state);
  const navigate = useNavigate();
  const location = useLocation(); // Get location to check for state
  
  const [updateStatus, setUpdateStatus] = useState("waiting"); // waiting, updating, success, error
  const [pointsAdded, setPointsAdded] = useState(0);
  const [isValidVisit, setIsValidVisit] = useState(false);
  
  // Get user from context
  const { user: contextUser, setUser } = useContext(UserContext);
  
  // Create a local reliable user state
  const [currentUser, setCurrentUser] = useState(null);
  const [userDataFetched, setUserDataFetched] = useState(false);

  const { amount_of_question } = useSelector((state) => state);
  
  // Check if this is a valid visit to the score page
  useEffect(() => {
    // Check for a completion token in sessionStorage
    const completionToken = sessionStorage.getItem('trivio_completion_token');
    
    // Check if we have a state from navigation (Questions component should pass this)
    const hasValidState = location.state && location.state.fromQuestions === true;
    
    if (completionToken || hasValidState) {
      setIsValidVisit(true);
      
      // If we came from Questions, store a token for potential refreshes
      if (hasValidState) {
        // Generate a unique token that includes timestamp
        const token = `completed_${Date.now()}`;
        sessionStorage.setItem('trivio_completion_token', token);
      }
    } else {
      console.log("Invalid access to score page - redirecting to home");
      // Redirect after a short delay so user sees what happened
      setTimeout(() => {
        navigate('/');
      }, 1500);
    }
  }, [location, navigate]);
  
  // 1. First, ensure we have the latest user from Firebase Auth
  useEffect(() => {
    console.log("Setting up auth listener in FinalScore");
    
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        try {
          // Get the latest Firestore data for this user
          const userDocRef = doc(db, "Users", authUser.uid);
          const userSnapshot = await getDoc(userDocRef);
          
          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            
            // Create complete user object with both auth and Firestore data
            const completeUser = {
              uid: authUser.uid,
              email: authUser.email,
              name: userData.name || "User",
              points: userData.points || 0,
              ...userData
            };
            
            // Update both our local state and context
            setCurrentUser(completeUser);
            
            // Only update context if different to avoid loops
            if (!contextUser || contextUser.uid !== completeUser.uid) {
              setUser(completeUser);
            }
            
            console.log("User authenticated with latest data:", completeUser.name);
          } else {
            console.warn("User document not found in Firestore");
            setCurrentUser(null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setCurrentUser(null);
        } finally {
          setUserDataFetched(true);
        }
      } else {
        console.log("No user is authenticated");
        setCurrentUser(null);
        setUserDataFetched(true);
      }
    });
    
    return () => unsubscribe();
  }, [setUser, contextUser]);
  
  // 2. Now handle point updates once we have reliable user data
  useEffect(() => {
    // Don't proceed if this isn't a valid visit
    if (!isValidVisit) {
      console.log("Skipping point update - invalid visit");
      return;
    }
    
    // Wait until user data is confirmed fetched
    if (!userDataFetched) {
      console.log("Waiting for user data to be fetched...");
      return;
    }
    
    // Get the completion token - this helps us verify this is a legit score
    const completionToken = sessionStorage.getItem('trivio_completion_token');
    
    // Create a unique update key using the completion token
    const updateKey = `trivio_score_update_${completionToken}`;
    
    // Check if already updated using this token
    if (sessionStorage.getItem(updateKey)) {
      console.log("Points already updated for this quiz completion");
      setUpdateStatus("success");
      return;
    }
    
    // Don't proceed if no score or no user
    if (score <= 0) {
      console.log("No score to update");
      return;
    }
    
    if (!currentUser) {
      console.log("No authenticated user to update points for");
      setUpdateStatus("error");
      return;
    }

    const updateUserPoints = async () => {
      try {
        setUpdateStatus("updating");
        console.log(`Updating points for ${currentUser.name} with score: ${score}`);
        
        // Calculate points to add (score × 15)
        const pointsToAdd = score * 15;
        setPointsAdded(pointsToAdd);
        
        // Get current points value from our reliable user data
        const currentPoints = currentUser.points || 0;
        const newPoints = currentPoints + pointsToAdd;

        const questionsAnswered = Number(currentUser.questionsAnswered || 0) + Number(amount_of_question);// get from Redux or props
        const questionsCorrect = (currentUser.questionsCorrect || 0) + score;
        const accuracy = questionsAnswered > 0 ? (questionsCorrect / questionsAnswered) : 0;
        
        // Update Firestore
        const userDocRef = doc(db, "Users", currentUser.uid);
        await updateDoc(userDocRef, {
          points: newPoints,
          questionsAnswered,
          questionsCorrect,
          accuracy,
        });
        
        // Mark as updated in sessionStorage using the completion token
        sessionStorage.setItem(updateKey, "true");
        
        console.log(`Points updated successfully: ${currentPoints} → ${newPoints}`);
        setUpdateStatus("success");
        
        // Update context with new points value
        setUser({
          ...currentUser,
          points: newPoints,
          questionsAnswered,
          questionsCorrect,
          accuracy,
        });
      } catch (error) {
        console.error("Error updating points:", error);
        setUpdateStatus("error");
      }
    };
    
    // Only run if we have confirmed user data and haven't updated yet
    if (currentUser && userDataFetched && updateStatus === "waiting") {
      updateUserPoints();
    }
  }, [currentUser, userDataFetched, score, updateStatus, setUser, isValidVisit]);

  const handleBackToHome = () => {
    // Reset Redux state
    dispatch(handleScoreChange(0));
    dispatch(handleAmountChange(50));
    
    // Clear the completion token when leaving
    sessionStorage.removeItem('trivio_completion_token');
    
    // Navigate home
    navigate("/");
  };

  // Display user feedback with additional invalid access message if needed
  return (
    <div className="mt-20 text-center">
      {!isValidVisit ? (
        <div className="text-red-500 mb-8">
          <h2 className="text-2xl font-bold">Unauthorized Access</h2>
          <p>You must complete a quiz to view this page.</p>
          <p className="text-sm mt-2">Redirecting to home page...</p>
        </div>
      ) : (
        <>
          <h2 className="text-3xl font-bold mb-5">Your Final Score: {score}</h2>
          
          {score > 0 && (
            <div className="mb-5">
              {!userDataFetched && (
                <p className="text-gray-500">Connecting to your account...</p>
              )}
              
              {userDataFetched && !currentUser && (
                <p className="text-red-500">
                  Please log in to save your points.
                </p>
              )}
              
              {updateStatus === "waiting" && userDataFetched && currentUser && (
                <p className="text-gray-500">Preparing to update points...</p>
              )}
              
              {updateStatus === "updating" && (
                <p className="text-blue-500">Updating your points...</p>
              )}
              
              {updateStatus === "success" && (
                <p className="text-green-500">
                  Successfully added {pointsAdded || (score * 15)} points to your account!
                </p>
              )}
              
              {updateStatus === "error" && currentUser && (
                <p className="text-red-500">
                  Error updating points. Please try again later.
                </p>
              )}
              
              {currentUser && (
                <p className="text-sm mt-4">
                  Playing as: {currentUser.name} | Current Points: {currentUser.points}
                </p>
              )}
            </div>
          )}
        </>
      )}
      
      <button
        onClick={handleBackToHome}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Back to Home
      </button>
    </div>
  );
};

export default FinalScore;
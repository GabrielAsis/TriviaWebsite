import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

// Firebase imports
import { signOut } from "firebase/auth";
import { auth, db } from "../src/Components/firebase";
import { doc, getDoc } from "firebase/firestore";

import { Button } from "@/components/ui/button";


export const Dashboard = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up the auth state listener
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log("User authenticated:", user.uid);
        try {
          const docRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserDetails({
              uid: user.uid,
              ...docSnap.data()
            });
          } else {
            console.log("User document not found");
            toast.error("Could not load user profile");
            setUserDetails(null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error("Error loading profile data");
          setUserDetails(null);
        }
      } else {
        console.log("User is not logged in");
        setUserDetails(null);
      }
      setLoading(false);
    });
    
    // Clean up function to unsubscribe when component unmounts
    return () => unsubscribe();
  }, []);

  async function handleLogout() {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
      navigate('/'); // Redirect to home page
    } catch (error) {
      console.error("Error logging out:", error.message);
      toast.error('Failed to log out. Please try again.');
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col space-y-4 justify-center items-center w-full h-[100vh] text-center">
        <div className="w-18 h-18 border-8 border-t-8 border-gray-300 border-t-primary rounded-full animate-spin"></div>
        <h3 className="ml-2">Loading your profile...</h3>
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="container py-20">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4">Not Logged In</h2>
          <p className="mb-6">Please log in to view your dashboard.</p>
          <button 
            onClick={() => navigate('/')} 
            className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Go to Home
          </button>
          <Button 
              onClick={handleLogout} 
              variant="destructive"
            >
              Logout
            </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-20">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-primary text-white p-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <h2 className="text-xl mt-2">Welcome back, {userDetails.name}!</h2>
        </div>
        
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-4">Profile Information</h3>
              <p className="mb-2"><span className="font-medium">Name:</span> {userDetails.name}</p>
              <p className="mb-2"><span className="font-medium">Email:</span> {userDetails.email}</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-4">Trivia Stats</h3>
              
              {userDetails.points ? (
                <div>
                  <div className="mb-4">
                    <p className="text-3xl font-bold text-primary">{userDetails.points}</p>
                    <p className="text-sm text-gray-600">Total Points</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32">
                  <p className="text-center mb-3">No points yet 😢</p>
                  <p className="text-center text-sm text-gray-600">Start earning points by answering some trivia!</p>
                  <Button 
                    onClick={() => navigate('/play')} 
                  >
                    Play Trivia
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <Button 
              onClick={handleLogout} 
              variant="destructive"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/userContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

// Firebase imports
import { signOut } from "firebase/auth";
import { auth, db } from "../src/Components/firebase";
import { doc, getDoc } from "firebase/firestore";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

import { ArrowRight, LogIn, LogOut, Puzzle } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Dashboard = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placement, setPlacement] = useState(null); // <-- Add this
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const details = { uid: user.uid, ...docSnap.data() };
            setUserDetails(details);

            // Fetch all users sorted by points
            const usersRef = collection(db, "Users");
            const q = query(usersRef, orderBy("points", "desc"));
            const querySnapshot = await getDocs(q);
            const usersList = [];
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              // Only include users with points > 0
              if ((data.points ?? 0) > 0) {
                usersList.push({ id: doc.id, ...data });
              }
            });

            // Find the user's rank (index + 1)
            const rank = usersList.findIndex(u => u.id === user.uid);
            setPlacement(rank !== -1 ? rank + 1 : null);
          }
        } catch (error) {
          // handle error
        }
      }
      setLoading(false);
    });

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
    <div className="pt-[112px] bg-off-white">   
      <div className='py-20'>
        <div className='bg-white w-full max-w-[700px] m-auto rounded-xl shadow-sm overflow-hidden flex flex-col items-center justify-center'>
          {/* USER POINTS */} 
          <div className='p-6 bg-primary w-full flex flex-col items-center text-white'>
            {userDetails.points ? (
              <>
                <h5>Your Points</h5>
                <div className='text-white flex flex-row items-center justify-center gap-3'>
                  <Puzzle strokeWidth={0} width={30} height={30} fill='#3c39c7' className='bg-off-white rounded-full p-2' />
                  <h3 className='font-bold'>{userDetails.points} points</h3>
                </div>
              </>
            ) : (
              <>
                <div className='text-white flex flex-row items-center justify-center gap-3'>
                  <h3 className='font-bold'> No Points Yet</h3>
                </div>
                  <Link>
                    <Button variant="ghost2">
                      Play Now 
                      <ArrowRight strokeWidth={2} />
                    </Button>
                  </Link>
              </>
            )}
          </div>

          {/* USER DETAILS */}
          <div className='w-full p-6 bg-secondary rounded-t-xl -mt-2.5 flex flex-col justify-center items-center text-white gap-2'>
            <Avatar className='w-20 h-20'>
              <AvatarImage src='' />
              <AvatarFallback className='text-3xl'>
                {userDetails.name
                ? userDetails.name
                    .match(/[A-Z]/g) // Extract uppercase letters (e.g., "GabrielAsis" → "GA")
                    ?.slice(0, 2) // Take the first two letters
                    .join('') || userDetails.name.slice(0, 2).toUpperCase() // Fallback to first two characters if no uppercase letters
                : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className='flex flex-col gap-0.5 text-center'>
              <h3 className='font-medium'>{userDetails.name}</h3>
              <p className='text-off-white/80 text-sm'>{userDetails.email}</p>
            </div>
            {placement &&
              <div className='bg-off-white text-black p-1.5 px-4 rounded-full mt-6 w-full flex flex-row justify-between items-center'>
                <div className='flex flex-row justify-between items-center gap-2'>
                  <div className='font-medium text-white bg-primary w-6 h-6 aspect-square rounded-full flex justify-center items-center'>{placement}</div>
                  <h5>Leaderboard Placement</h5>
                </div>
                <Link to="/leaderboard" className='flex flex-row items-center gap-2 hover:underline text-sm'>
                  View Leaderboards <ArrowRight strokeWidth={2} size={15}/>
                </Link>
              </div>
            }
          </div>

          {/* ADDITIONAL INFO */}
          <div className='p-6 bg-white w-full flex flex-row justify-around items-center gap-8'>
            <div className='text-center'>
              <h2 className='text-primary font-bold'>
                {userDetails.questionsAnswered
                  ? `${((userDetails.questionsCorrect / userDetails.questionsAnswered) * 100).toFixed(1)}%`
                  : "N/A"}
              </h2>
              <p className='text-gray text-sm'>Accuracy score</p>
            </div>
            <div className='text-center'>
              <h2 className='text-primary font-bold'>
                {userDetails.questionsAnswered ? userDetails.questionsAnswered : "N/A"}
              </h2>
              <p className='text-gray text-sm'>Questions Answered</p>
            </div>
            <div className='text-center'>
              <h2 className='text-primary font-bold'>
                {userDetails.questionsCorrect ? userDetails.questionsCorrect : "N/A"}
              </h2>
              <p className='text-gray text-sm'>Correct Answers</p>
            </div>
          </div>

          <Button variant="destructive" className="my-6" onClick={handleLogout}>
            Logout
            <LogOut />
          </Button>
        </div>
      </div>    
    </div>
  );
};
import { useState, useContext } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';

// shadcn imports
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// assets imports
import { logo } from '../src/assets';

// Firebase imports
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../src/Components/firebase";
import { getDoc, doc } from "firebase/firestore";

export default function Login({ isOpen, setIsOpen, openRegister, onLoginSuccess }) {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loginUser = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      // Sign in the user with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get additional user data from Firestore
      const userDoc = await getDoc(doc(db, "Users", user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Create a user object with data from auth and Firestore
        const userInfo = {
          uid: user.uid,
          email: user.email,
          name: userData.name,
          points: userData.points || 0, // Include points in the user context
          // Add any other fields you need from Firestore
        };
        
        // Update context with user data
        setUser(userInfo);
        
        // Store auth token in localStorage if needed
        // Note: Firebase handles tokens automatically, but you can store UID or custom token
        localStorage.setItem('token', user.uid);
        
        console.log("User logged in successfully");
        toast.success('Login Successful. Welcome Back!');
        setIsOpen(false);
        
        if (onLoginSuccess) {
          onLoginSuccess(); // Call the callback to update parent state
        }
      } else {
        // This case handles if the user exists in Authentication but not in Firestore
        console.error("User document doesn't exist in Firestore");
        setError("User profile not found. Please contact support.");
        toast.error("User profile not found");
      }
    } catch (error) {
      console.error("Login error:", error.message);
      let errorMessage = "Failed to login. Please check your credentials.";
      
      // Handle specific Firebase auth errors with more user-friendly messages
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = "Invalid email or password";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed login attempts. Please try again later.";
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = "Network error. Please check your connection.";
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="whiteOutline">
          Log In
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={loginUser}>
          <div className="grid grid-cols-1 gap-6">
            {/* HEADER & DESC */}
            <div className='space-y-2'>
              <div className='flex flex-row justify-center items-center space-x-3'>
                <h2>Welcome back to <span className='text-primary'>Trivio</span></h2>
                <img src={logo} className='w-8 h-auto' alt="Trivio Logo" />
              </div>
              <p className='text-center text-gray'>Sign in to start racking up points, climb the leaderboard, and track your trivia progress across all categories.</p>
            </div>

            {/* INPUTS */}
            <div className='space-y-4'>
              {/* EMAIL INPUT */}
              <div className='space-y-2'>
                <label className="block text-sm font-medium text-gray">Email</label>
                <Input
                  type="email"
                  value={email}
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* PASSWORD INPUT */}
              <div className='space-y-2'>
                <label className="block text-sm font-medium text-gray">Password</label>
                <Input
                  type="password"
                  value={password}
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

            <div>
              <p className='text-gray text-center'>Don't have an account? <span 
                className='text-foreground font-medium underline cursor-pointer hover:text-gray'
                onClick={openRegister}
              >
                Sign Up!
              </span></p>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
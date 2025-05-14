import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast'

// shadcn imports
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// assets imports
import { logo } from '../src/assets';

import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../src/Components/firebase";
import { setDoc, doc } from "firebase/firestore";

export default function Register({ isOpen, setIsOpen, openLogin }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      // Create the user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Now we have the authenticated user with a valid UID
      console.log("User authenticated:", user.uid);
      
      // Store additional user data in Firestore with points initialized to 0
      await setDoc(doc(db, "Users", user.uid), {
        email: email, 
        name: username,
        points: 0
      });
      
      console.log("User registered successfully");
      
      // Sign out the user immediately after registration
      await signOut(auth);
      
      // Close the register dialog and show success message
      setIsOpen(false);
      toast.success('Account registered successfully! Please login to continue.');
      setTimeout(() => {
        openLogin(); // This opens the login modal
      }, 300);
          
    } catch (error) {
      console.error("Registration error:", error.message, error.code);
      
      // Provide more user-friendly error messages
      let errorMessage = "Failed to create account. Please try again.";
      
      // Handle specific Firebase auth errors with more professional messages
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This email address is already in use.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Please provide a valid email address.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Please use a stronger password with at least 6 characters.";
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = "Please check your internet connection and try again.";
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
        <Button variant="white">
          Sign Up
        </Button>
      </DialogTrigger>
      <DialogContent className="space-y-6">
        <form onSubmit={handleRegister}>
          <div className="grid grid-cols-1 gap-6">
            {/* HEADER & DESC */}
            <div className='space-y-2'>
              <div className='flex flex-row justify-center items-center space-x-3'>
                <h2>Welcome to <span className='text-primary'>Trivio</span></h2>
                <img src={logo} className='w-8 h-auto' alt="Trivio Logo" />
              </div>
              <p className='text-center text-gray'>Create an account to start earning points, climb the leaderboard, and track your trivia journey across all categories.</p>
            </div>
            
            {/* INPUTS */}
            <div className='space-y-4'>
              {/* NAME INPUT */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">Name</label>
                <Input 
                  type="text"
                  value={username}
                  placeholder="Enter your name"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              {/* EMAIL INPUT */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">Email</label>
                <Input 
                  type="email"
                  value={email}
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* PASSWORD INPUT */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">Password</label>
                <Input 
                  type="password"
                  value={password}
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>

            <div>
              <p className='text-gray text-center'>Already have an account? <span className='text-foreground font-medium underline cursor-pointer hover:text-gray' onClick={openLogin}>
                Log In!
              </span></p>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
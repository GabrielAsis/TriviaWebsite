import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// shadcn imports
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// assets imports
import { logo } from '../src/assets';

export default function Register({ isOpen, setIsOpen, openLogin }) {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const registerUser = async (e) => {
    e.preventDefault();
    const { name, email, password } = data;
    try {
      const { data } = await axios.post('/register', { name, email, password });
      if (data.error) {
        toast.error(data.error);
      } else {
        setData({});
        toast.success('Registration Successful. Welcome!');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="white">
          Sign Up
        </Button>
      </DialogTrigger>
      <DialogContent className="spacey-y-8">
        <form onSubmit={registerUser}>
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
                  value={data.name}
                  placeholder="Enter your name"
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                />
                
              </div>

              {/* EMAIL INPUT */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">Email</label>
                <Input 
                  type="email"
                  value={data.email}
                  placeholder="Enter your email"
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                />
              </div>

              {/* PASSWORD INPUT */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">Password</label>
                <Input 
                  type="password"
                  value={data.password}
                  placeholder="Enter your password"
                  onChange={(e) => setData({ ...data, password: e.target.value })}
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <Button
              type="submit"
            >
              Sign Up
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
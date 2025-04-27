import { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';

// shadcn imports
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// assets imports
import { logo } from '../src/assets';

export default function Login({ isOpen, setIsOpen, openRegister }) {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const [data, setData] = useState({
    email: '',
    password: ''
  });

  const loginUser = async (e) => {
    e.preventDefault();
    const { email, password } = data;
    try {
      const { data } = await axios.post('/login', { email, password });
      if (data.error) {
        toast.error(data.error);
      } else {
        setData({});
        setUser(data);
        toast.success('Login Successful. Welcome Back!');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog  open={isOpen} onOpenChange={setIsOpen}>
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
                  value={data.email}
                  placeholder="Enter your email"
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                />
              </div>

              {/* PASSWORD INPUT */}
              <div className='space-y-2'>
                <label className="block text-sm font-medium text-gray">Password</label>
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
              Login
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

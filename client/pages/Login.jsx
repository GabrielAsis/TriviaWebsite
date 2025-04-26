import { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';

// shadcn imports
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// assets imports
import { logo } from '../src/assets';

export default function Login() {
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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="whiteOutline">
          Log In
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center inline">
            <div className='flex flex-row justify-center items-center space-x-2'>
              <h2>Welcome to <span className='text-primary'>Trivio</span></h2>
              <img src={logo} className='w-7 h-auto' />
            </div>
          </DialogTitle>
          <DialogDescription>Access your account to continue.</DialogDescription>
        </DialogHeader>
        <form onSubmit={loginUser}>
          <div className="grid grid-cols-1 gap-4">
            {/* EMAIL INPUT */}
            <div>
              <label className="block text-sm font-medium text-gray-900">Email</label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                className="block w-full rounded-md border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            {/* PASSWORD INPUT */}
            <div>
              <label className="block text-sm font-medium text-gray-900">Password</label>
              <input
                type="password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                className="block w-full rounded-md border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500"
            >
              Submit
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
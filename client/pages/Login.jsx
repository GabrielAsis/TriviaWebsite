import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate(); 

  const [data, setData] = useState({
    email: '',
    password: ''
  })

  const loginUser = async (e) => {
    e.preventDefault()
    const {email, password} = data;
    try {
      const {data} = await axios.post('/login', {email, password});
      if(data.error) {
        toast.error(data.error)
      } else {
        setData({});
        navigate('/dashboard');
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <form onSubmit={loginUser}>
        <div className='grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-1'>
          {/* EMAIL INPUT */}
          <div className="">
              <label className="block text-sm/6 font-medium text-gray-900 text-left">
                Email
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  value={data.email} onChange={(e) => setData({...data, email: e.target.value})}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
          </div>

          {/* PASSWORD INPUT */}
          <div className="">
            <label className="block text-sm/6 font-medium text-gray-900 text-left">
              Password
            </label>
            <div className="mt-2">
              <input
                type="password"
                value={data.password} onChange={(e) => setData({...data, password: e.target.value})}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="col-span-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-full"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}

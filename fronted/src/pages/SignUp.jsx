import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../main';
import axios from "axios";
import {useDispatch} from "react-redux"
import { setUserData } from '../redux/userSlice';

function SignUp() {
  let navigate = useNavigate();
  let [showPassword, setShowPassword] = useState(false);
  let [userName,setUserName]=useState("")
  let [email,setEmail]=useState("")
  let [password,setPassword]=useState("")
  let [signupError,setSignupError]=useState("")
   const [loading, setLoading] = useState(false);
  let dispatch=useDispatch()
  

  const handleSignup=async (e)=>{
    e.preventDefault()
    setSignupError("")
    setLoading(true)
    try{
      let result=await axios.post(`${serverUrl}/api/auth/signup`,{userName,email,password},{withCredentials:true})
      dispatch(setUserData(result.data))
      setUserName("")
      setEmail("")
      setPassword("")
      setLoading(false)
    }
    catch(error){
      setSignupError(error.response?.data?.message || "Unable to create your account. Please try again.")
    }
    
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-cyan-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(14,116,144,0.15)]">
        <div className="bg-gradient-to-r from-cyan-500 to-sky-500 px-6 pb-14 pt-10 shadow-lg shadow-cyan-200/60">
          <h1 className="text-center text-3xl font-bold tracking-tight text-slate-800">
            Welcome to <span className="text-white">Chatly</span>
          </h1>
          <p className="mt-3 text-center text-sm text-cyan-50/90">
            Create your account to start chatting
          </p>
        </div>

        <form className="-mt-8 space-y-5 bg-white px-6 pb-8 pt-6 rounded-t-[2rem]" onSubmit={handleSignup}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
             required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100" onChange={(e)=>setUserName(e.target.value)} value={userName}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"  onChange={(e)=>setEmail(e.target.value)} value={email}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                minLength={6}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"  onChange={(e)=>setPassword(e.target.value)} value={password}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-xs font-semibold text-cyan-600 transition hover:text-cyan-700"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {signupError && (
            <p className="text-sm text-red-600" role="alert">
              {signupError}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-200 transition hover:from-cyan-600 hover:to-sky-600" disabled={loading}
          >
          {loading?"Loading...":"signup"}
          </button>

          <p className="text-center text-sm text-slate-500">
            Already have an account?{' '}
            <span
              onClick={() => navigate('/login')}
              className="cursor-pointer font-semibold text-cyan-600 hover:text-cyan-700"
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUp;

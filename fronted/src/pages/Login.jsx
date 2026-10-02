import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../main';
import {useDispatch} from "react-redux"
import { setUserData } from '../redux/userSlice';


function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  let dispatch=useDispatch()
 
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      dispatch(setUserData(result.data))
      setEmail("")
      setPassword("")
      
    } catch (error) {
      const message = error.response?.data?.message;

      if (message === 'user not exist' || message === 'incorrect password') {
        setError('Wrong email or password. Please try again.');
      } else {
        setError(message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-cyan-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(14,116,144,0.15)]">
        <div className="bg-gradient-to-r from-cyan-500 to-sky-500 px-6 pb-14 pt-10 shadow-lg shadow-cyan-200/60">
          <h1 className="text-center text-3xl font-bold tracking-tight text-slate-800">
            Welcome to <span className="text-white">Chatly</span>
          </h1>
          <p className="mt-3 text-center text-sm text-cyan-50/90">
            login to your account to start chatting
          </p>
        </div>

        <form onSubmit={handleLogin} className="-mt-8 space-y-5 bg-white px-6 pb-8 pt-6 rounded-t-[2rem]">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-700 outline-none transition focus:ring-4 ${
                error
                  ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100'
                  : 'border-slate-200 bg-slate-50 focus:border-cyan-400 focus:bg-white focus:ring-cyan-100'
              }`}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={`w-full rounded-xl border px-4 py-3 pr-12 text-sm text-slate-700 outline-none transition focus:ring-4 ${
                  error
                    ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100'
                    : 'border-slate-200 bg-slate-50 focus:border-cyan-400 focus:bg-white focus:ring-cyan-100'
                }`}
                required
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

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-200 transition hover:from-cyan-600 hover:to-sky-600 disabled:cursor-not-allowed disabled:opacity-70" 
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>

          <p className="text-center text-sm text-slate-500">
            Want to create a new account?{' '}
            <span
              onClick={() => navigate('/signup')}
              className="cursor-pointer font-semibold text-cyan-600 hover:text-cyan-700"
            >
              Signup
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;

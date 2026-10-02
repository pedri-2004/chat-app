import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import useCurrentUser from './customHooks/getCurrentUser';
import {useSelector} from "react-redux"
import Profile from './pages/Profile';
import Home from './pages/Home';
function App() {
  useCurrentUser()
  let {userData}=useSelector((state)=>state.user)
  return (
    
    <Routes>

      <Route path='/login' element={!userData?<Login/>:<Navigate to='/'/>} />
      <Route path='/signup' element={!userData?<SignUp/>:<Navigate to='/profile'/>} />
      <Route path='/' element={userData?<Home/>:<Navigate to='/Login'/>} />
      <Route path='/profile' element={userData?<Profile/>:<Navigate to='/Signup'/>} />
    </Routes>
  );
}

export default App;

import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import useCurrentUser from './customHooks/getCurrentUser';
import { useSelector } from "react-redux";
import Profile from './pages/Profile';
import Home from './pages/Home';
import useOtherUser from './customHooks/getOtherUsers';

function App() {
  useCurrentUser();
  const { userData } = useSelector((state) => state.user);
  useOtherUser(userData?._id);

  return (
    <Routes>
      <Route path='/login' element={!userData ? <Login /> : <Navigate to='/' />} />
      <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to='/profile' />} />
      <Route path='/' element={userData ? <Home /> : <Navigate to='/login' />} />
      <Route path='/profile' element={userData ? <Profile /> : <Navigate to='/signup' />} />
    </Routes>
  );
}

export default App;

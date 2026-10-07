import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoIosSearch } from 'react-icons/io';
import { RiLogoutBoxLine } from 'react-icons/ri';
import { RxCross2 } from 'react-icons/rx';
import dp from '../assets/dp.jpg';
import { serverUrl } from '../main';
import { setOtherUsers, setSelectedUser, setUserData } from '../redux/userSlice';

function SideBar() {
  const { userData, otherUsers, selectedUser } = useSelector((state) => state.user);
  const [search, setSearch] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      dispatch(setUserData(null));
      dispatch(setOtherUsers(null));
      navigate('/login');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <aside className={`${selectedUser ? 'hidden lg:flex' : 'flex'} h-full min-h-0 w-full shrink-0 flex-col border-r border-slate-200 bg-white lg:w-[320px]`}>
      <header className='border-b border-slate-100 px-5 pb-5 pt-6'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-wider text-teal-700'>Chatly</p>
            <h1 className='mt-1 text-xl font-semibold text-slate-900'>Chat with friends</h1>
            <p className='mt-1 text-sm text-slate-500'>Hi, {userData?.name || userData?.userName || 'user'}</p>
          </div>
          <button type='button' className='h-10 w-10 overflow-hidden rounded-full ring-2 ring-slate-100 transition hover:ring-teal-200' onClick={() => navigate('/profile')} aria-label='Open profile'>
            <img src={userData?.image || dp} alt='' className='h-full w-full object-cover'/>
          </button>
        </div>

        <div className='mt-5'>
          {!search ? (
            <button type='button' className='flex h-10 w-full items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm text-slate-500 transition hover:border-teal-300 hover:bg-slate-50' onClick={() => setSearch(true)}>
              <IoIosSearch className='h-5 w-5'/>
              <span>Search users</span>
            </button>
          ) : (
            <form className='flex h-10 items-center gap-2 rounded-lg border border-teal-300 bg-white px-3 shadow-sm'>
              <IoIosSearch className='h-5 w-5 shrink-0 text-slate-400'/>
              <input type='text' placeholder='Search users...' className='h-full min-w-0 flex-1 border-0 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400'/>
              <button type='button' className='text-slate-400 transition hover:text-slate-700' onClick={() => setSearch(false)} aria-label='Close search'>
                <RxCross2 className='h-5 w-5'/>
              </button>
            </form>
          )}
        </div>
      </header>

      <section className='min-h-0 flex-1 overflow-y-auto px-3 py-4'>
        <h2 className='px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400'>Chats</h2>
        <div className='space-y-1'>
          {otherUsers?.map((user) => (
            <button key={user._id} type='button' className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition ${selectedUser?._id === user._id ? 'bg-teal-50 text-teal-900' : 'text-slate-700 hover:bg-slate-50'}`} onClick={() => dispatch(setSelectedUser(user))}>
              <span className='h-11 w-11 shrink-0 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200'>
                <img src={user.image || dp} alt='' className='h-full w-full object-cover'/>
              </span>
              <span className='min-w-0 flex-1'>
                <span className='block truncate text-sm font-medium'>{user.name || user.userName}</span>
                {user.userName && user.name && user.userName !== user.name && (
                  <span className='mt-0.5 block truncate text-xs text-slate-500'>@{user.userName}</span>
                )}
              </span>
            </button>
          ))}
        </div>
      </section>

      <div className='border-t border-slate-100 px-4 py-3'>
        <button type='button' className='flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900' onClick={handleLogOut} aria-label='Log out'>
          <RiLogoutBoxLine className='h-4 w-4'/>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default SideBar;

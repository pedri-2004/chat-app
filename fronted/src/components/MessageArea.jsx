import { useState } from 'react';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import Picker from 'emoji-picker-react';
import dp from '../assets/dp.jpg';
import { setSelectedUser } from '../redux/userSlice';
import { RiEmojiStickerLine } from "react-icons/ri";
import { FaImages } from "react-icons/fa";
import { RiSendInsLine } from "react-icons/ri";

function MessageArea() {
  const { selectedUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const onEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <main className={`${selectedUser ? 'flex' : 'hidden lg:flex'} min-w-0 flex-1 flex-col bg-slate-50`}>
      {selectedUser ? (
        <>
          <header className='flex h-[76px] shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 sm:px-6'>
            <div className='flex min-w-0 items-center gap-3'>
              <button type='button' className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900' onClick={() => dispatch(setSelectedUser(null))} aria-label='Back to chats'>
                <IoIosArrowRoundBack className='h-7 w-7'/>
              </button>
              <div className='h-11 w-11 shrink-0 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200'>
                <img src={selectedUser.image || dp} alt='' className='h-full w-full object-cover'/>
              </div>
              <div className='min-w-0'>
                <h1 className='truncate font-semibold text-slate-900'>{selectedUser.name || selectedUser.userName || 'user'}</h1>
                <p className='text-sm text-slate-500'>Conversation</p>
              </div>
            </div>
          </header>
          <section className='flex flex-1 items-center justify-center px-6 py-10'>
            <p className='text-center text-sm text-slate-500'>Your conversation will appear here.</p>
          </section>

          <div className='relative mt-auto w-full px-3 pb-4 sm:px-5 lg:px-6'>
            <form className='relative z-10 mx-auto flex h-[60px] w-full max-w-[760px] items-center gap-3 rounded-full bg-[#1797c2] px-3 shadow-[0_10px_30px_rgba(15,23,42,0.18)] sm:px-4'>
              <div className='relative'>
                {showEmojiPicker && (
                  <div className='absolute bottom-[calc(100%+12px)] left-0 z-[60] w-[min(80vw,260px)] max-w-[calc(100vw-32px)] pointer-events-auto'>
                    <div className='overflow-hidden rounded-2xl bg-white shadow-[0_25px_60px_rgba(15,23,42,0.22)] [&_.epr-main]:!h-[260px] [&_.epr-main]:!w-full [&_.epr-body]:!h-[220px] [&_.epr-search]:!hidden [&_.epr-preview]:!hidden [&_.epr-emoji]:!text-base [&_.epr-category-nav]:!hidden [&_.epr-emoji-category-label]:!text-xs'>
                      <Picker onEmojiClick={onEmojiClick} theme='light' skinTonesDisabled searchDisabled previewConfig={{ showPreview: false }} />
                    </div>
                  </div>
                )}
                <button type='button' onClick={() => setShowEmojiPicker((prev) => !prev)} className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition hover:bg-white/10' aria-label='Add emoji'>
                  <RiEmojiStickerLine className='h-5 w-5 cursor-pointer' />
                </button>
              </div>

              <input
                type='text'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder='Type a message...'
                className='h-full flex-1 border-0 bg-transparent text-sm text-white placeholder:text-slate-100 focus:outline-none'
              />

              <div className='flex items-center gap-2'>
                <button type='button' className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition hover:bg-white/10 cursor-pointer' aria-label='Add image'>
                  <FaImages className='h-4 w-4' />
                </button>
                <button type='submit' className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/20' aria-label='Send message'>
                  <RiSendInsLine className='h-4 w-4 cursor-pointer' />
                </button>
              </div>
            </form>
          </div>
        </>
      ) : (
        <section className='flex flex-1 items-center justify-center px-6 py-10'>
          <div className='text-center'>
            <p className='text-xs font-semibold uppercase tracking-wider text-teal-700'>Chatly</p>
            <h1 className='mt-2 text-lg font-semibold text-slate-800'>Welcome to Chatly</h1>
            <p className='mt-1 text-sm text-slate-500'>Choose a chat to get started.</p>
          </div>
        </section>
      )}
    </main>
  );
}

export default MessageArea;

import { useEffect, useRef, useState } from 'react';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import Picker from 'emoji-picker-react';
import dp from '../assets/dp.jpg';
import { setSelectedUser } from '../redux/userSlice';
import { appendMessage, setMessage as setMessagesInRedux } from '../redux/messageSlice';
import { RiEmojiStickerLine } from 'react-icons/ri';
import { FaImages } from 'react-icons/fa';
import { RiSendInsLine } from 'react-icons/ri';
import SenderMessage from './SenderMessage';
import ReceiverMessage from './ReceiverMessage';
import { serverUrl } from '../main';
import axios from 'axios';

function MessageArea() {
  const { selectedUser, userData,socket } = useSelector((state) => state.user);
  const { messages = [] } = useSelector((state) => state.message || {});
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const image = useRef(null);
  const previewImage = selectedImage ? URL.createObjectURL(selectedImage) : '';

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const trimmedMessage = message.trim();
    if ((!trimmedMessage && !selectedImage) || !selectedUser?._id) return;

    const newMessage = {
      _id: Date.now().toString(),
      sender: userData?._id || selectedUser._id,
      receiver: selectedUser._id,
      message: trimmedMessage,
      image: selectedImage ? previewImage : '',
    };

    dispatch(setMessagesInRedux([...messages, newMessage]));
    setMessage('');
    setSelectedImage(null);
    if (image.current) image.current.value = '';

    try {
      const formData = new FormData();
      if (trimmedMessage) formData.append('message', trimmedMessage);
      if (selectedImage) formData.append('image', selectedImage);
      await axios.post(`${serverUrl}/api/message/send/${selectedUser._id}`, formData, { withCredentials: true });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const onEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImage(file);
  };
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (incomingMessage) => {
      const senderId = String(incomingMessage.sender?._id || incomingMessage.sender);
      if (senderId === String(selectedUser?._id)) {
        dispatch(appendMessage(incomingMessage));
      }
    };

    socket.on('newMessage', handleNewMessage);
    return () => socket.off('newMessage', handleNewMessage);
  }, [socket, selectedUser?._id, dispatch]);


  return (
    <main className={`${selectedUser ? 'flex' : 'hidden lg:flex'} min-w-0 flex-1 flex-col bg-slate-50`}>
      {selectedUser ? (
        <>
          <header className='flex h-[76px] shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 sm:px-6'>
            <div className='flex min-w-0 items-center gap-3'>
              <button type='button' className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900' onClick={() => dispatch(setSelectedUser(null))} aria-label='Back to chats'>
                <IoIosArrowRoundBack className='h-7 w-7' />
              </button>
              <div className='h-11 w-11 shrink-0 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200'>
                <img src={selectedUser.image || dp} alt='' className='h-full w-full object-cover' />
              </div>
              <div className='min-w-0'>
                <h1 className='truncate font-semibold text-slate-900'>{selectedUser.name || selectedUser.userName || 'user'}</h1>
                <p className='text-sm text-slate-500'>Conversation</p>
              </div>
            </div>
          </header>

          <section className='flex flex-1 flex-col gap-3 overflow-y-auto bg-gradient-to-b from-slate-100 via-slate-50 to-white px-4 py-5 sm:px-6'>
            {messages.length === 0 ? (
              <div className='mt-auto flex items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/70 px-4 py-10 text-center text-sm text-slate-500'>
                Start the conversation with a message.
              </div>
            ) : (
             messages.map((msg) =>
                msg.sender === userData?._id ? (
                  <SenderMessage key={msg._id || `${msg.message}-${Math.random()}`} text={msg.message || msg.text} image={msg.image || ''} />
                ) : (
                  <ReceiverMessage key={msg._id || `${msg.message}-${Math.random()}`} text={msg.message || msg.text} image={msg.image || ''} />
                )
              )
            )}
          </section>
          

          <div className='relative mt-auto w-full px-3 pb-4 sm:px-5 lg:px-6'>
            <form onSubmit={handleSendMessage} className='relative z-10 mx-auto flex h-[60px] w-full max-w-[760px] items-center gap-3 rounded-full bg-[#1797c2] px-3 shadow-[0_10px_30px_rgba(15,23,42,0.18)] sm:px-4'>
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

              {selectedImage && (
                <div className='absolute -top-20 left-0 flex items-center gap-2 rounded-full bg-white/90 px-2 py-1 shadow-md'>
                  <img src={previewImage} alt='selected preview' className='h-12 w-12 rounded-lg object-cover' />
                  <button type='button' onClick={() => setSelectedImage(null)} className='text-xs font-medium text-slate-700'>Remove</button>
                </div>
              )}

              <input type='file' accept='image/*' ref={image} hidden onChange={handleImage} />
              <input
                type='text'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder='Type a message...'
                className='h-full flex-1 border-0 bg-transparent text-sm text-white placeholder:text-slate-100 focus:outline-none'
              />

              <div className='flex items-center gap-2'>
                <button type='button' className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition hover:bg-white/10 cursor-pointer' aria-label='Add image' onClick={() => image.current?.click()}>
                  <FaImages className='h-4 w-4 cursor-pointer' />
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

import React from 'react';

function ReceiverMessage({ text = '', image = '' }) {
  return (
    <div className='mr-auto flex max-w-[78%] flex-col items-start'>
      {image && <img src={image} alt='' className='mb-2 max-h-52 w-[160px] rounded-xl object-cover shadow-sm' />}
      {text && (
        <div className='rounded-2xl rounded-tl-md bg-slate-200 px-4 py-2 text-sm text-slate-800 shadow-[0_8px_18px_rgba(15,23,42,0.08)]'>
          {text}
        </div>
      )}
    </div>
  );
}

export default ReceiverMessage;

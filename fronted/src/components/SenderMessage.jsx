import React from 'react';

function SenderMessage({ text = '', image = '' }) {
  return (
    <div className='ml-auto flex max-w-[78%] flex-col items-end'>
      {image && <img src={image} alt='' className='mb-2 max-h-52 w-[160px] rounded-xl object-cover shadow-sm' />}
      {text && (
        <div className='rounded-2xl rounded-tr-md bg-[#1797c2] px-4 py-2 text-sm text-white shadow-[0_8px_18px_rgba(23,151,194,0.28)]'>
          {text}
        </div>
      )}
    </div>
  );
}

export default SenderMessage;

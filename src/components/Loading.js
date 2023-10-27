import React, { useRef } from 'react';


function Loading() {
  return (
    <div className="w-full p-5">
      <label
        className="flex justify-center  w-full h-96 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none"
      >
        <span className="flex items-center space-x-2">

        <span className="loading loading-spinner loading-lg"></span>
        </span>
      </label>
    </div>
  );
}

export default Loading;

import React from 'react';

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl">
          <span className="text-white font-bold text-2xl">SM</span>
        </div>
        <p className="text-gray-300">Loading ShiftMind…</p>
        <div className="w-48 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full w-1/2 bg-gradient-to-r from-blue-400 to-purple-500 animate-[bounce_1.2s_ease-in-out_infinite]"></div>
        </div>
      </div>
    </div>
  );
}



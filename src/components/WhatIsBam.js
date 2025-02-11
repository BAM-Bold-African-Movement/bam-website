import React from 'react';

const WhatIsBam = () => {
  return (
    <div className="bg-black py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* 3D Model/Image */}
          <div className="relative h-[400px] w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-gray-800">
              {/* You can add a 3D model or image here */}
              <div className="w-full h-full flex items-center justify-center">
                <svg 
                  className="w-32 h-32 text-gray-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <h2 className="text-4xl font-bold text-white mb-6">
              What is BAM?
            </h2>
            <p className="text-gray-300 text-lg mb-6">
              BAM is a revolutionary blockchain platform for cryptocurrency trading and development. Our mission is to provide a secure and efficient ecosystem for users to trade, invest, and grow their digital assets with real-time market intelligence.
            </p>
            <p className="text-gray-300 text-lg mb-8">
              Download BAM and start your journey in cryptocurrency trading with advanced tools and features designed for both beginners and experienced traders.
            </p>
            <button 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all duration-300"
            >
              GET STARTED
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatIsBam; 
import React, { useState } from 'react';

const WhatIsBam = () => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-black py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image Section */}
          <div className="relative h-[400px] w-full">
            <div className="absolute inset-0 rounded-2xl border border-gray-800 overflow-hidden">
              {!imageError ? (
                <img 
                  src="assests/img/moja1.jpg"
                  alt="What is BAM"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Error loading image:', e);
                    setImageError(true);
                    // Try alternative path if first one fails
                    e.target.src = 'assests/img/moja1.jpg';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <p className="text-gray-400">Image not found</p>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div>
            <h2 className="text-4xl font-bold text-white mb-6">
              What is BAM?
            </h2>
            <p className="text-gray-300 text-lg mb-6">
            We are committed to building a diverse and collaborative community where everyone has a chance to succeed. and To catalyze transformation and drive impactful innovation in Africa's tech landscape.
            </p>
            <p className="text-gray-300 text-lg mb-8">
            We are dedicated to fostering a diverse and collaborative community that empowers individuals to succeed while driving transformative and impactful innovation in Africa's tech landscape.
            </p>
            <button 
              onClick={() => window.open('https://a6mb8nr1tm7.typeform.com/to/jm0FBILA?typeform-source=joinbam.carrd.co', '_blank')}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all duration-300"
            >
              JOIN NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatIsBam; 
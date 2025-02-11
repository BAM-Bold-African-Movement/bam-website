import React from 'react';

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute w-full h-full object-cover"
        style={{ filter: 'brightness(0.3)' }}
      >
        <source 
          src="assests/img/bam4.mp4" 
          type="video/mp4" 
        />
        Your browser does not support the video tag.
      </video>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-6xl font-bold text-white mb-6">
          Future of Cryptocurrency
        </h1>
        <p className="text-xl text-gray-300 mb-12">
          Revolutionizing digital transactions with blockchain technology
        </p>
        
        <div className="max-w-md mx-auto">
          <input
            type="email"
            placeholder="Your email address"
            className="w-full px-4 py-3 rounded-lg mb-4 bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:border-white/40"
          />
          <button 
            className="w-full py-3 px-6 rounded-lg text-white font-semibold text-lg"
            style={{
              background: 'linear-gradient(to right, #FFD700, #FFA500)',
            }}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero; 
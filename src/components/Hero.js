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
          src="/assests/img/bam4.mp4" 
          type="video/mp4" 
        />
        Your browser does not support the video tag.
      </video>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
          Future of Cryptocurrency
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-300 px-4 sm:px-0">
          Empowering African Innovation for a Tech-Driven Future
        </p>
        <div className="mt-8 sm:mt-10 flex justify-center space-x-4">
          <button className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors duration-300">
            Get Started
          </button>
          <button className="border border-white text-white px-6 py-2 rounded-lg hover:bg-white/20 transition-colors duration-300">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
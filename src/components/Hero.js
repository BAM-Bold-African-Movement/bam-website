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
        <p className="text-xl text-gray-300">
         Empowering African Innovation for a Tech-Driven Future
        </p>
      </div>
    </div>
  );
};

export default Hero; 
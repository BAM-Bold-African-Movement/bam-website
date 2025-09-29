import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute w-full h-full object-cover dark:brightness-[0.3] brightness-[0.6]"
      >
        <source 
          src="/assests/img/bam4.mp4" 
          type="video/mp4" 
        />
        Your browser does not support the video tag.
      </video>
      
      {/* Overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/20 dark:bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
          Empowering Africa's Next Generation of Innovators
        </h1>
        <p className="text-sm sm:text-base text-gray-300 px-4 sm:px-0">
          Building a movement where African talent meets Web3, blockchain, and frontier technologies to shape the future.
        </p>
        <div className="mt-8 sm:mt-10 flex flex-wrap justify-center gap-4">
          <Button 
            variant="gradient"
            size="lg"
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            Get Started
          </Button>
          <Link href="/donations">
            <Button 
              variant="outline"
              size="lg"
              className="border-white/80 text-white hover:bg-white/10 hover:text-white"
            >
              Donate
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
import React, { useState, useEffect } from 'react';

const InvestorLogos = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const logos = [
    {
      id: 1,
      src: "/img/investors/binance.png",
      alt: "Binance"
    },
    {
      id: 2,
      src: "/img/investors/coinbase.png",
      alt: "Coinbase"
    },
    {
      id: 3,
      src: "/img/investors/kraken.png",
      alt: "Kraken"
    },
    {
      id: 4,
      src: "/img/investors/gemini.png",
      alt: "Gemini"
    },
    {
      id: 5,
      src: "/img/investors/ftx.png",
      alt: "FTX"
    }
  ];

  // Auto scroll every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        return nextIndex >= Math.ceil(logos.length / 5) ? 0 : nextIndex;
      });
    }, 5000); // Changed to 5000ms (5 seconds)

    // Cleanup on component unmount
    return () => clearInterval(timer);
  }, [logos.length]);

  return (
    <div className="bg-black py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Why Investors Choose Us
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Trusted by industry leaders who believe in decentralizing AI to empower individuals, foster innovation, and build a future where AI benefits everyone.
          </p>
        </div>
        
        <div className="relative overflow-hidden">
          {/* Logo Carousel */}
          <div 
            className="flex transition-transform duration-1000 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            <div className="flex min-w-full justify-between items-center px-8">
              {logos.map((logo) => (
                <div 
                  key={logo.id}
                  className="w-28 h-16 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
                >
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="max-w-full max-h-full object-contain brightness-0 invert"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: Math.ceil(logos.length / 5) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  currentIndex === index ? 'bg-white' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorLogos; 
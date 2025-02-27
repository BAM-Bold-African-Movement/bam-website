import React, { useState, useEffect } from 'react';

const InvestorLogos = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const logos = [
    {
      id: 1,
      src: "/assests/img/buni logo.png",
      alt: "Buni",
    },
    {
      id: 2,
      src: "/assests/img/klinkfinance_logo.jpeg",
      alt: "Klink Finance",
    },
    {
      id: 3,
      src: "/assests/img/sortedwallet_logo.png",
      alt: "Sorted Wallet",
    },
    {
      id: 4,
      src: "/assests/img/tether logo.png",
      alt: "Tether",
    },
    {
      id: 5,
      src: "/assests/img/icp logo.png",
      alt: "ICP",
    },
    {
      id: 6,
      src: "/assests/img/coin.png",
      alt: "Coin",
    },
    {
      id: 7,
      src: "/assests/img/coderr.png",
      alt: "Coderr",
    },
    {
      id: 8,
      src: "/assests/img/yelloww.png",
      alt: "Yellow",
    },
    {
      id: 9,
      src: "/assests/img/exo.png",
      alt: "Exo",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        return nextIndex >= Math.ceil(logos.length / 5) ? 0 : nextIndex;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [logos.length]);

  // Calculate visible logos based on current index
  const getVisibleLogos = () => {
    const start = currentIndex * 5;
    const visibleLogos = [...logos.slice(start), ...logos.slice(0, start)];
    return visibleLogos;
  };

  return (
    <div className="bg-black py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Our Partners
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Collaborating with leading institutions to empower African tech innovation and foster growth in the ecosystem.
          </p>
        </div>
        
        <div className="relative overflow-hidden">
          <div className="flex transition-transform duration-1000 ease-in-out">
            <div className="flex flex-nowrap gap-16 min-w-full px-8 justify-center items-center">
              {getVisibleLogos().map((logo) => (
                <div 
                  key={logo.id}
                  className="flex-shrink-0 flex items-center justify-center hover:scale-110 transition-all duration-300"
                  style={{
                    width: '200px',  // Fixed width container
                    height: '100px'  // Fixed height container
                  }}
                >
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="object-contain w-full h-full"
                    style={{ 
                      filter: 'none',
                      mixBlendMode: 'normal',
                      maxWidth: '160px',    // Maximum width for the image
                      maxHeight: '80px',    // Maximum height for the image
                      margin: 'auto'        // Center the image in container
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-8 space-x-3">
            {Array.from({ length: Math.ceil(logos.length / 5) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  currentIndex === index ? 'bg-yellow-500' : 'bg-gray-600'
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
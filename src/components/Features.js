import React, { useState, useEffect } from 'react';

const Features = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const features = [
    {
      title: "Node Collect",
      description: "Contribute bandwidth for real-time data crawling and indexing.",
      image: "/img/node-collect.png",
    },
    {
      title: "Node Compute",
      description: "Process and analyze data through our distributed network.",
      image: "/img/node-compute.png",
    },
    {
      title: "Node Store",
      description: "Securely store and manage distributed data across the network.",
      image: "/img/node-store.png",
    }
  ];

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [features.length]);

  // Manual slide change
  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="bg-black py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            The Nodepay Ecosystem
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Within the Nodepay AI Ecosystem, users can earn for both passive and active contributions. The more you participate, the more you earn.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="h-32 mb-4 flex items-center justify-center">
                <img 
                  src={feature.image} 
                  alt={feature.title}
                  className="h-full w-auto object-contain"
                />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {feature.description}
              </p>
              <button 
                className="w-full text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                style={{
                  background: 'linear-gradient(to right, #FFD700, #FFA500)',
                }}
              >
                GET STARTED
              </button>
            </div>
          ))}
        </div>

        {/* Dots Indicator with click handler */}
        <div className="flex justify-center mt-6 space-x-2">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSlideChange(index)}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                currentSlide === index ? 'bg-indigo-600' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features; 
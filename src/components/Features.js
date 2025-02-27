import React, { useState, useEffect } from 'react';

const Features = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageErrors, setImageErrors] = useState({});

  const features = [
    {
      title: "Educate and Empower",
      description: "African talent and startups by providing resources, mentorship, and opportunities to thrive in the tech ecosystem.",
      image: "/assests/img/moja1.jpg"
    },
    {
      title: "Hackthon",
      description: "We organize hackathons to solve real-world challenges and develop tech skills.",
      image: "/assests/img/mbili2.jpg"
    },
    {
      title: "Workshop",
      description: "We organize workshops to onboard more people to emerging technologies like web3.",
      image: "/assests/img/moja1.jpg"
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
    <div id="features" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            The BAM Ecosystem
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Within the BAM Ecosystem, users can earn for both passive and active contributions.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="h-48 mb-6 flex items-center justify-center p-4">
                <img 
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    console.error(`Error loading image: ${feature.image}`);
                    setImageErrors(prev => ({
                      ...prev,
                      [feature.image]: true
                    }));
                    e.target.src = '/assests/img/fallback-image.jpg';
                  }}
                  style={{
                    opacity: imageErrors[feature.image] ? 0.5 : 1
                  }}
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-base mb-6 line-clamp-2">
                {feature.description}
              </p>
              <button 
                onClick={() => window.open('https://a6mb8nr1tm7.typeform.com/to/jm0FBILA?typeform-source=joinbam.carrd.co', '_blank')}
                className="w-full text-white px-6 py-3 rounded-lg text-base font-medium transition-all duration-300"
                style={{
                  background: 'linear-gradient(to right, #FFD700, #FFA500)',
                }}
              >
                JOIN NOW
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
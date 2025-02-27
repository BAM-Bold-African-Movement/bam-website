import React from 'react';

const GlobalPlatform = () => {
  return (
    <div className="bg-black py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-6">
            A Global Platform for blockchain african movement
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Join the African Bold Movement (BAM) and be part of a thriving community that champions diversity, collaboration, and innovation in Africa’s tech landscape. We are on a mission to drive transformation by empowering individuals, businesses, and communities with cutting-edge technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {/* Global Nodes */}
          <div className="relative">
            <div className="text-5xl font-bold text-white mb-2">
              100k
              <span className="text-blue-500 ml-1">+</span>
            </div>
            <p className="text-gray-400">Events in Africa</p>
          </div>

          {/* Countries */}
          <div className="relative">
            <div className="text-5xl font-bold text-white mb-2">
              54
              <span className="text-blue-500 ml-1">+</span>
            </div>
            <p className="text-gray-400">Countries</p>
          </div>

          {/* Enterprise Partners */}
          <div className="relative">
            <div className="text-5xl font-bold text-white mb-2">
              20
              <span className="text-blue-500 ml-1">+</span>
            </div>
            <p className="text-gray-400">Enterprise Partners</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalPlatform; 
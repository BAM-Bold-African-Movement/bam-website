import React from 'react';

const GlobalPlatform = () => {
  return (
    <div className="bg-black py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-6">
            A Global Platform for Collective Intelligence
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Join a worldwide network of nodes contributing to a decentralized AI platform — processing millions of interactions and empowering innovation across various industries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {/* Global Nodes */}
          <div className="relative">
            <div className="text-5xl font-bold text-white mb-2">
              1.8M
              <span className="text-blue-500 ml-1">+</span>
            </div>
            <p className="text-gray-400">Global Nodes</p>
          </div>

          {/* Countries */}
          <div className="relative">
            <div className="text-5xl font-bold text-white mb-2">
              180
              <span className="text-blue-500 ml-1">+</span>
            </div>
            <p className="text-gray-400">Countries</p>
          </div>

          {/* Enterprise Partners */}
          <div className="relative">
            <div className="text-5xl font-bold text-white mb-2">
              21
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
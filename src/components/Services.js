import React from 'react';

const Services = () => {
  return (
    <div id="services" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Our Services</h2>
          <p className="text-gray-400 text-xl">Comprehensive blockchain solutions for your business</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Service 1 */}
          <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-lg hover:transform hover:scale-105 transition-all duration-300">
            <div className="text-yellow-400 mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">Crypto Trading</h3>
            <p className="text-gray-400">Advanced trading platform with real-time analytics and secure transactions.</p>
          </div>

          {/* Service 2 */}
          <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-lg hover:transform hover:scale-105 transition-all duration-300">
            <div className="text-yellow-400 mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">Blockchain Consulting & Security</h3>
            <p className="text-gray-400">Providing strategic advisory, audits, and security solutions for blockchain implementations.</p>
          </div>

          {/* Service 3 */}
          <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-lg hover:transform hover:scale-105 transition-all duration-300">
            <div className="text-yellow-400 mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">Organizational Development</h3>
            <p className="text-gray-400">Advanced security protocols and monitoring for your digital assets.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services; 
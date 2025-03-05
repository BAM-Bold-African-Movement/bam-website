import React from 'react';

const DonationDetailsForm = ({ 
  donationOptions, 
  selectedOption, 
  setSelectedOption, 
  customAmount, 
  setCustomAmount, 
  donorName, 
  setDonorName, 
  email, 
  setEmail, 
  error, 
  handleProceedToPayment,
  handleCustomAmountChange 
}) => {
  return (
    <div className="max-w-lg mx-auto bg-white rounded-lg shadow-sm p-8">
      <div className="flex items-center mb-6">
        <img 
          src="/assests/img/BAM transparent.png" 
          alt="BAM Logo" 
          className="h-10 mr-3" 
        />
        <h2 className="text-2xl font-bold">Support BAM's Mission</h2>
      </div>
      
      <p className="text-gray-600 mb-8">
        Help us drive impactful innovation in Africa's tech ecosystem. Your donation supports hackathons, workshops, mentorship programs, and resources to empower African talent and startups. Join us in building the future of tech in Africa.
      </p>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Enter customer details</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Customer name</label>
            <input 
              type="text" 
              value={donorName} 
              onChange={e => setDonorName(e.target.value)} 
              placeholder="Customer name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Email address</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="Email address"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Select donation amount</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {donationOptions.map(option => (
            <div 
              key={option.id} 
              className={`border rounded-lg p-4 cursor-pointer transition-all duration-200
                ${selectedOption === option.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
              onClick={() => setSelectedOption(option.id)}
            >
              <h4 className="font-medium text-gray-800">{option.name}</h4>
              {option.id !== 'custom' && <p className="text-blue-600 font-bold">${option.price}</p>}
            </div>
          ))}
        </div>
        
        {selectedOption === 'custom' && (
          <div className="mt-3">
            <label className="block text-gray-700 mb-2">Custom amount</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <input 
                type="text" 
                value={customAmount} 
                onChange={handleCustomAmountChange}
                placeholder="0.00"
                className="w-full pl-8 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <button 
        onClick={handleProceedToPayment} 
        className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Next
      </button>
    </div>
  );
};

export default DonationDetailsForm;
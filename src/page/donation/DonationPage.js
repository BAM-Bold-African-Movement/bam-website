// DonationPage.js
import React, { useState, useEffect } from 'react';
import { SERVER_URL } from '../../utils/config';
import { Link } from 'react-router-dom';

export default function DonationPage() {
  const [donationOptions, setDonationOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState('details'); // 'details' or 'payment'
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch donation options
    fetch(`${SERVER_URL}/v1/api/donation-options`)
      .then(res => res.json())
      .then(data => setDonationOptions(data.donationOptions))
      .catch(err => console.error('Error fetching donation options:', err));
  }, []);

  const calculateAmount = () => {
    if (selectedOption === 'custom') {
      return customAmount;
    } else {
      const option = donationOptions.find(opt => opt.id === selectedOption);
      return option ? option.price.toString() : '0';
    }
  };

  const validateForm = () => {
    setError('');
    
    if (!donorName.trim()) {
      setError('Please enter your name');
      return false;
    }
    
    if (!email.trim()) {
      setError('Please enter your email');
      return false;
    }
    
    if (!selectedOption) {
      setError('Please select a donation amount');
      return false;
    }
    
    if (selectedOption === 'custom') {
      if (!customAmount.trim()) {
        setError('Please enter a custom amount');
        return false;
      }
      
      const amount = parseFloat(customAmount);
      if (isNaN(amount) || amount <= 0) {
        setError('Please enter a valid amount greater than 0');
        return false;
      }
    }
    
    return true;
  };

  const handleProceedToPayment = () => {
    if (validateForm()) {
      setStep('payment');
    }
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    // Allow only positive numbers with up to 2 decimal places
    if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
      setCustomAmount(value);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Panel with Logo */}
      <div className="hidden lg:flex lg:w-1/2 bg-white items-center justify-center p-12">
        <div className="max-w-md">
          <img
            src="/assests/img/BAM transparent.png"
            alt="BAM Logo"
            className="w-64 mx-auto mb-12"
          />
        </div>
      </div>

      {/* Right Panel with Form */}
      <div className="w-full lg:w-1/2 p-8">
        {step === 'details' ? (
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
        ) : (
          <div className="max-w-lg mx-auto bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center mb-6">
              <img 
                src="/assests/img/BAM transparent.png" 
                alt="BAM Logo" 
                className="h-10 mr-3" 
              />
              <h2 className="text-2xl font-bold">Payment Details</h2>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600">Donation Amount: <span className="font-bold text-blue-600">${calculateAmount()}</span></p>
              <p className="text-gray-600">Name: {donorName}</p>
              <p className="text-gray-600">Email: {email}</p>
            </div>
            
            {/* Payment component would go here */}
            <div className="border border-gray-300 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
              {/* This is where you would integrate your payment processor */}
              <p className="text-gray-600">Payment processing components would be integrated here.</p>
            </div>
            
            <div className="flex space-x-4">
              <button 
                onClick={() => setStep('details')} 
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button 
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Complete Donation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
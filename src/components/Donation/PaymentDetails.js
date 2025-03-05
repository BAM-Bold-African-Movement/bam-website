import React from 'react';

const PaymentDetailsForm = ({ 
    donorName, 
    email, 
    calculateAmount, 
    setStep 
  }) => {
    return (
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
        
        <div className="border border-gray-300 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
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
    );
};

export default PaymentDetailsForm;
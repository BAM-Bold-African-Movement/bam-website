import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Checkout, CheckoutButton, CheckoutStatus } from '@coinbase/onchainkit/checkout';
import { CDP_API_KEY } from '../../utils/config';

const PaymentDetailsForm = ({ 
    donorName, 
    email, 
    calculateAmount, 
    chargeId 
  }) => {
    const navigate = useNavigate();
  
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
          <Checkout
            apiKey={CDP_API_KEY}
            chargeId={chargeId}
            onSuccess={() => navigate(`/mint-nft/${chargeId}`)}
          >
            <CheckoutButton />
            <CheckoutStatus />
          </Checkout>
        </div>
      </div>
    );
};

export default PaymentDetailsForm;
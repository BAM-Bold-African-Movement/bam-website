import React, { useState, useEffect, useParams } from 'react';
import { SERVER_URL } from '../../utils/config';
import { Link } from 'react-router-dom';
import DonationDetailsForm from '../../components/Donation/DonationDetails';
import PaymentDetailsForm from '../../components/Donation/PaymentDetails';

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

      {/* Right Panel with Form - Added overflow-y-auto for scrolling */}
      <div className="w-full lg:w-1/2 p-8 overflow-y-auto max-h-screen">
        {step === 'details' ? (
          <DonationDetailsForm 
            donationOptions={donationOptions}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            customAmount={customAmount}
            setCustomAmount={setCustomAmount}
            donorName={donorName}
            setDonorName={setDonorName}
            email={email}
            setEmail={setEmail}
            error={error}
            handleProceedToPayment={handleProceedToPayment}
            handleCustomAmountChange={handleCustomAmountChange}
          />
        ) : (
          <PaymentDetailsForm 
            donorName={donorName}
            email={email}
            calculateAmount={calculateAmount}
            setStep={setStep}
          />
        )}
      </div>
    </div>
  );
}
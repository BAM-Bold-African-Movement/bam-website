// DonationPage.js
import React, { useState, useEffect } from 'react';
import { ConnectWallet, Wallet } from "@coinbase/onchainkit/wallet";
import { Checkout, CheckoutButton, CheckoutStatus } from "@coinbase/onchainkit/checkout";
import { SERVER_URL } from '../utils/config';

export default function DonationPage() {
  const [donationOptions, setDonationOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [email, setEmail] = useState('');
  const [chargeId, setChargeId] = useState('');
  const [isCheckoutReady, setIsCheckoutReady] = useState(false);
  const [donationStats, setDonationStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch donation options
    fetch(`${SERVER_URL}/api/donation-options`)
      .then(res => res.json())
      .then(data => setDonationOptions(data.donationOptions))
      .catch(err => console.error('Error fetching donation options:', err));
      
    // Fetch donation stats
    fetchDonationStats();
  }, []);

  const fetchDonationStats = () => {
    fetch(`${SERVER_URL}/api/donation-stats`)
      .then(res => res.json())
      .then(data => setDonationStats(data))
      .catch(err => console.error('Error fetching donation stats:', err));
  };

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

  const handleCreateCharge = async () => {
    if (!validateForm()) {
      return;
    }

    const amount = calculateAmount();
    
    try {
      const response = await fetch(`${SERVER_URL}/api/create-charge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount, 
          metadata: { donorName, email, donationType: selectedOption } 
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.chargeId) {
        setChargeId(data.chargeId);
        setIsCheckoutReady(true);
      } else {
        setError(data.error || 'Error creating payment charge');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error connecting to the server');
    }
  };

  const handlePaymentSuccess = async () => {
    // Payment is confirmed via webhook, just refresh stats
    fetchDonationStats();
    
    // Reset form
    setDonorName('');
    setEmail('');
    setSelectedOption(null);
    setCustomAmount('');
    setChargeId('');
    setIsCheckoutReady(false);
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    // Allow only positive numbers with up to 2 decimal places
    if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
      setCustomAmount(value);
    }
  };

  return (
    <div className="donation-page">
      <h1>Support Our Cause</h1>
      
      {donationStats && (
        <div className="donation-stats">
          <h3>Donation Stats</h3>
          <p>Total Raised: ${donationStats.totalAmount.toFixed(2)}</p>
          <p>Number of Donors: {donationStats.donorCount}</p>
          
          {donationStats.recentDonations.length > 0 && (
            <div className="recent-donations">
              <h4>Recent Donations</h4>
              <ul>
                {donationStats.recentDonations.map((donation, index) => (
                  <li key={index}>
                    {donation.donorName} - ${donation.amount.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {!isCheckoutReady ? (
        <div className="donation-form">
          <div className="form-group">
            <label>Your Name</label>
            <input 
              type="text" 
              value={donorName} 
              onChange={e => setDonorName(e.target.value)} 
              placeholder="Name"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="Email"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Select Donation Amount</label>
            <div className="donation-options">
              {donationOptions.map(option => (
                <div 
                  key={option.id} 
                  className={`donation-option ${selectedOption === option.id ? 'selected' : ''}`}
                  onClick={() => setSelectedOption(option.id)}
                >
                  <h3>{option.name}</h3>
                  {option.id !== 'custom' && <p>${option.price}</p>}
                  <p>{option.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {selectedOption === 'custom' && (
            <div className="form-group">
              <label>Enter Custom Amount</label>
              <div className="custom-amount-input">
                <span className="currency-symbol">$</span>
                <input 
                  type="text" 
                  value={customAmount} 
                  onChange={handleCustomAmountChange}
                  placeholder="0.00"
                  required
                />
              </div>
              <small>Enter an amount greater than $0</small>
            </div>
          )}
          
          <button onClick={handleCreateCharge} className="create-charge-btn">
            Continue to Payment
          </button>
        </div>
      ) : (
        <div className="checkout-container">
          <h2>Complete Your Donation</h2>
          <p>Donation Amount: ${calculateAmount()}</p>
          
          <Wallet>
            <ConnectWallet />
          </Wallet>
          
          <Checkout chargeId={chargeId} onSuccess={handlePaymentSuccess}>
            <CheckoutButton />
            <CheckoutStatus />
          </Checkout>
          
          <button onClick={() => setIsCheckoutReady(false)} className="back-btn">
            Back
          </button>
        </div>
      )}
    </div>
  );
}
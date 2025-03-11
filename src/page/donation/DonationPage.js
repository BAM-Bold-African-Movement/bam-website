import React, { useState, useEffect, useParams } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SERVER_URL } from '../../utils/config';
import { Link } from 'react-router-dom';
import DonationDetailsForm from '../../components/Donation/DonationDetails';
import PaymentDetailsForm from '../../components/Donation/PaymentDetails';

export default function DonationPage() {
  const [step, setStep] = useState('details'); // 'details' or 'payment'
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-50">


      {/* Right Panel with Form - Added overflow-y-auto for scrolling */}
      <div className="w-full lg:w-1/2 p-8 overflow-y-auto max-h-screen">
        {step === 'details' ? (
          <DonationDetailsForm 
          />
        ) : (
          {
          /*
          <PaymentDetailsForm 
            donorName={donorName}
            email={email}
            calculateAmount={calculateAmount}
            chargeId={chargeId}
          /> */}
        )}
      </div>
    </div>
  );
}
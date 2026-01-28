'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DonationDetailsForm from '@/components/Donation/donation-details';
import PaymentDetailsForm from '@/components/Donation/payment-details';

export default function DonationPage() {
  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [donorData, setDonorData] = useState({
    name: '',
    email: '',
    amount: 0,
    message: ''
  });
  
  const router = useRouter();

  const handleDetailsSubmit = (data: typeof donorData) => {
    setDonorData(data);
    setStep('payment');
  };

  const handleBack = () => {
    setStep('details');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Right Panel with Form */}
      <div className="w-full lg:w-1/2 p-8 overflow-y-auto max-h-screen mx-auto">
        {step === 'details' ? (
          <DonationDetailsForm />
        ) : (
          <PaymentDetailsForm 
            donorData={donorData}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
}
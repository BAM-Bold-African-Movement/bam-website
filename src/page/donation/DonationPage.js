import React, { useState } from 'react';
import DonationDetailsForm from '../../components/Donation/DonationDetails';

export default function DonationPage() {
  const [step] = useState('details'); // 'details' or 'payment'

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
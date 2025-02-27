import React from 'react';
import Hero from './Hero';
import WhatIsBam from './WhatIsBam';
import Features from './Features';
import Services from './Services';
import GlobalPlatform from './GlobalPlatform';
import InvestorLogos from './InvestorLogos';
import Footer from './Footer';

const MainContent = () => {
  return (
    <div className="min-h-screen pt-20">
      <Hero />
      <WhatIsBam />
      <Features />
      <Services />
      <GlobalPlatform />
      <InvestorLogos />
      <Footer />
    </div>
  );
};

export default MainContent; 
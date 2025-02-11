import React, { useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhatIsBam from './components/WhatIsBam';
import Services from './components/Services';
import Features from './components/Features';
import GlobalPlatform from './components/GlobalPlatform';
import InvestorLogos from './components/InvestorLogos';
import Blog from './components/Blog';
import Footer from './components/Footer';
import Login from './components/Auth/Login';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Dashboard from './components/Dashboard/Dashboard';

const MainContent = () => {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const servicesRef = useRef(null);
  const contactRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Navbar 
        onHomeClick={() => scrollToSection(heroRef)}
        onFeaturesClick={() => scrollToSection(featuresRef)}
        onServicesClick={() => scrollToSection(servicesRef)}
        onContactClick={() => scrollToSection(contactRef)}
      />
      <div ref={heroRef}>
        <Hero />
      </div>
      <WhatIsBam />
      <div ref={servicesRef}>
        <Services />
      </div>
      <div ref={featuresRef}>
        <Features />
      </div>
      <GlobalPlatform />
      <InvestorLogos />
      <div ref={contactRef}>
        <Footer />
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black">
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/login" element={<Login />} />
          <Route path="/blog" element={
            <>
              <Navbar />
              <Blog />
              <Footer />
            </>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Navbar />
              <Dashboard />
              <Footer />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

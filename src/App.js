import React from 'react';
import '@coinbase/onchainkit/styles.css';
import '@rainbow-me/rainbowkit/styles.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import MainContent from './components/MainContent';
import Blog from './components/Blog';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import DonationPage from './page/donation/DonationPage';
import NftMintPage from './page/donation/NftMintPage';
import ConfirmationPage from './page/donation/ConfirmationPage';
import NotFound from './components/NotFound';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Contact from './components/Contact';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-900">
          <Routes>
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/" element={
              <>
                <Navbar />
                <MainContent />
              </>
            } />
            <Route path="/blog" element={
              <>
                <Navbar />
                <Blog />
              </>
            } />
            <Route path="/login" element={
              <>
                <Navbar />
                <Login />
              </>
            } />
            <Route path="/donations" element={
              <>
                <Navbar />
                <DonationPage />
              </>
            } />
            <Route path="/mint-nft" element={
              <>
                <Navbar />
                <NftMintPage />
              </>
            } />
            <Route path="/confirmation" element={
              <>
                <Navbar />
                <ConfirmationPage />
              </>
            } />
            <Route path="/contact" element={
              <>
                <Navbar />
                <Contact />
              </>
            } />
            {/* 404 Not Found Route - should be last */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
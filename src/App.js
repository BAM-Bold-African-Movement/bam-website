import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import MainContent from './components/MainContent';
import Blog from './components/Blog';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import DonationPage from './page/donation/DonationPage';
import NftMintPage from './page/donation/NftMintPage';
import ConfirmationPage from './page/donation/ConfirmationPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<MainContent />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/login" element={<Login />} />
                <Route path="/donations" element={<DonationPage />} />
                <Route path="/mint-nft" element={<NftMintPage />} />
                <Route path="/confirmation" element={<ConfirmationPage />} />
              </Routes>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React from 'react';
import '@coinbase/onchainkit/styles.css';
import '@rainbow-me/rainbowkit/styles.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Layout/Navbar';
import MainContent from './components/MainContent';
import Blog from './components/Blog';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import DonationPage from './page/donation/DonationPage';
import NftMintPage from './page/donation/NftMintPage';
import ConfirmationPage from './page/donation/ConfirmationPage';
import NotFound from './components/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import {Editor} from './components/Editor/Editor';
import BlogPostDetail from './components/BlogPostDetail';

function App() {
  return (
    <HelmetProvider>
    <Router>
      <div className="min-h-screen bg-gray-900">
        <Routes>
          {/* Protected Dashboard Route - Only Dashboard */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Separate Editor Route */}
          {/* <Route 
            path="/dashboard/editor" 
            element={
              <ProtectedRoute>
                <Editor />
              </ProtectedRoute>
            } 
          /> */}
          
          {/* Public Routes */}
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

          <Route path="/blog/:id" element={
            <>    
              <Navbar />
              <BlogPostDetail />
            </>
            
          }/>
          
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
          
          {/* 404 Not Found Route - should be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
    </HelmetProvider>
  );
}

export default App;
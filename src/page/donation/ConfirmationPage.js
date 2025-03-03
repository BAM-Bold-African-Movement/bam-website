import React from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function ConfirmationPage() {
  const location = useLocation();
  const { email, txHash, chain } = location.state || {};

  const chainExplorerUrls = {
    ethereum: 'https://etherscan.io/tx/',
    polygon: 'https://polygonscan.com/tx/',
    solana: 'https://explorer.solana.com/tx/',
    avalanche: 'https://snowtrace.io/tx/'
  };

  if (!email || !txHash || !chain) {
    return (
      <div className="confirmation-page error">
        <h1>Invalid Confirmation</h1>
        <p>Sorry, we couldn't find the details of your NFT mint.</p>
        <Link to="/" className="home-link">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="confirmation-page">
      <h1>NFT Minted Successfully!</h1>
      
      <div className="nft-display">
        <div className="nft-image">
          {/* This would be your dynamic NFT image */}
          <div className="placeholder-nft">
            <span>Donor NFT</span>
          </div>
        </div>
        
        <div className="nft-details">
          <h2>Thank You Donation NFT</h2>
          <p>This NFT represents your generous support of our cause.</p>
          
          <div className="detail-row">
            <span>Email:</span>
            <span>{email}</span>
          </div>
          
          <div className="detail-row">
            <span>Transaction:</span>
            <a 
              href={chainExplorerUrls[chain] + txHash} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {txHash.slice(0, 6)}...{txHash.slice(-4)}
            </a>
          </div>
          
          <div className="detail-row">
            <span>Chain:</span>
            <span>{chain.charAt(0).toUpperCase() + chain.slice(1)}</span>
          </div>
        </div>
      </div>
      
      <div className="sharing-section">
        <h3>Share Your Support</h3>
        <div className="social-buttons">
          <button className="twitter-share">Share on Twitter</button>
          <button className="facebook-share">Share on Facebook</button>
        </div>
      </div>
      
      <Link to="/" className="home-link">Return Home</Link>
    </div>
  );
}
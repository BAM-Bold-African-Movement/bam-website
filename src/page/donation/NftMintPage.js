import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConnectWallet, Wallet } from "@coinbase/onchainkit/wallet";
import { useAccount } from 'wagmi';
import { SERVER_URL } from '../../utils/config';


export default function NftMintPage() {
  const [email, setEmail] = useState('');
  const [eligibilityChecked, setEligibilityChecked] = useState(false);
  const [eligibilityData, setEligibilityData] = useState(null);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [selectedChain, setSelectedChain] = useState(null);
  const [chains, setChains] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const [whitelistId, setWhitelistId] = useState(null);
  const [mintingStatus, setMintingStatus] = useState('idle'); // idle, minting, success, error
  const [txHash, setTxHash] = useState('');
  
  const navigate = useNavigate();
  const { address } = useAccount();

  useEffect(() => {
    // Fetch supported chains
    fetch(`${SERVER_URL}/v1/api/supported-chains`)
      .then(res => res.json())
      .then(data => setChains(data.chains))
      .catch(err => console.error('Error fetching chains:', err));
  }, []);

  const checkEligibility = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    try {
      const response = await fetch(`${SERVER_URL}/v1/api/check-nft-eligibility`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setEligibilityData(data);
        setEligibilityChecked(true);
        
        if (!data.eligible) {
          setError(data.reason || 'Not eligible for NFT minting');
        }
      } else {
        setError(data.error || 'Error checking eligibility');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Connection error when checking eligibility');
    }
  };

  const whitelistWallet = async () => {
    setError('');
    
    if (!address) {
      setError('Please connect your wallet first');
      return;
    }
    
    if (!selectedDonation) {
      setError('Please select a donation');
      return;
    }
    
    if (!selectedChain) {
      setError('Please select a blockchain');
      return;
    }
    
    try {
      const response = await fetch(`${SERVER_URL}/v1/api/whitelist-wallet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          walletAddress: address,
          chain: selectedChain,
          donationId: selectedDonation
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setIsWhitelisted(true);
        setWhitelistId(data.whitelistId);
        setSuccess('Your wallet has been whitelisted! You can now mint your NFT.');
      } else {
        setError(data.error || 'Error whitelisting wallet');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Connection error when whitelisting wallet');
    }
  };

  const simulateMint = async () => {
    if (!isWhitelisted || !whitelistId) {
      setError('Your wallet must be whitelisted first');
      return;
    }
    
    setMintingStatus('minting');
    
    // In a real app, this would be your NFT minting logic
    // For this demo, we'll simulate the minting process
    setTimeout(() => {
      // Generate mock transaction hash
      const mockTxHash = '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      setTxHash(mockTxHash);
      
      // Confirm the mint with the backend
      fetch(`${SERVER_URL}/v1/api/confirm-nft-mint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          whitelistId,
          transactionHash: mockTxHash
        }),
      }).then(res => res.json())
        .then(data => {
          if (data.success) {
            setMintingStatus('success');
            setSuccess('NFT minted successfully!');
            
            // Redirect to confirmation page
            setTimeout(() => {
              navigate('/confirmation', { 
                state: { 
                  email, 
                  txHash: mockTxHash,
                  chain: selectedChain
                } 
              });
            }, 2000);
          } else {
            setMintingStatus('error');
            setError(data.error || 'Error confirming mint');
          }
        })
        .catch(err => {
          console.error('Error:', err);
          setMintingStatus('error');
          setError('Connection error when confirming mint');
        });
    }, 3000); // Simulate 3 second minting process
  };

  return (
    <div className="nft-mint-page">
      <h1>Mint Your Donor NFT</h1>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      {!eligibilityChecked ? (
        <div className="check-eligibility-form">
          <p>Enter the email you used for your donation to check eligibility:</p>
          <form onSubmit={checkEligibility}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
            />
            <button type="submit">Check Eligibility</button>
          </form>
        </div>
      ) : eligibilityData?.eligible ? (
        <div className="mint-container">
          {!isWhitelisted ? (
            <>
              <div className="donation-selection">
                <h3>Select Donation to Mint NFT For:</h3>
                <div className="donation-list">
                  {eligibilityData.donations
                    .filter(d => !d.nftMinted)
                    .map(donation => (
                      <div 
                        key={donation.id}
                        className={`donation-item ${selectedDonation === donation.id ? 'selected' : ''}`}
                        onClick={() => setSelectedDonation(donation.id)}
                      >
                        <p>Donation of ${donation.amount.toFixed(2)}</p>
                        <p>Date: {new Date(donation.timestamp.seconds * 1000).toLocaleDateString()}</p>
                      </div>
                    ))}
                </div>
              </div>
              
              <div className="chain-selection">
                <h3>Select Blockchain:</h3>
                <div className="chain-list">
                  {chains.map(chain => (
                    <div
                      key={chain.id}
                      className={`chain-item ${selectedChain === chain.id ? 'selected' : ''}`}
                      onClick={() => setSelectedChain(chain.id)}
                    >
                      <img src={chain.icon} alt={chain.name} />
                      <p>{chain.name}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="wallet-connect">
                <h3>Connect Your Wallet:</h3>
                <Wallet>
                  <ConnectWallet />
                </Wallet>
                
                {address && (
                  <div className="connected-wallet">
                    <p>Connected: {address.slice(0, 6)}...{address.slice(-4)}</p>
                  </div>
                )}
                
                <button 
                  onClick={whitelistWallet} 
                  disabled={!address || !selectedDonation || !selectedChain}
                  className="whitelist-button"
                >
                  Whitelist Wallet
                </button>
              </div>
            </>
          ) : (
            <div className="mint-nft-section">
              <h3>Mint Your Donor NFT</h3>
              <p>Your wallet {address.slice(0, 6)}...{address.slice(-4)} is now whitelisted to mint!</p>
              
              {mintingStatus === 'idle' && (
                <button onClick={simulateMint} className="mint-button">
                  Mint NFT
                </button>
              )}
              
              {mintingStatus === 'minting' && (
                <div className="minting-status">
                  <p>Minting in progress...</p>
                  <div className="spinner"></div>
                </div>
              )}
              
              {mintingStatus === 'success' && (
                <div className="minting-success">
                  <p>NFT Minted Successfully!</p>
                  <p>Transaction: {txHash.slice(0, 6)}...{txHash.slice(-4)}</p>
                  <p>Redirecting to confirmation page...</p>
                </div>
              )}
              
              {mintingStatus === 'error' && (
                <div className="minting-error">
                  <p>Error minting NFT. Please try again.</p>
                  <button onClick={simulateMint} className="retry-button">
                    Retry
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="not-eligible">
          <p>Sorry, you're not eligible to mint an NFT. {eligibilityData?.reason}</p>
          <button onClick={() => navigate('/')}>Donate Now</button>
        </div>
      )}
    </div>
  );
}
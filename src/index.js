import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import OnchainProviders from './components/Wallet/OnchainProviders'; 


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <OnchainProviders>
      <App />
    </OnchainProviders>
  </React.StrictMode>
);
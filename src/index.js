import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import OnchainProviders from './components/Wallet/OnchainProviders'; 
import { AuthProvider } from './contexts/AuthContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <OnchainProviders>
      <AuthProvider>
        <App />
      </AuthProvider>
    </OnchainProviders>
  </React.StrictMode>
);
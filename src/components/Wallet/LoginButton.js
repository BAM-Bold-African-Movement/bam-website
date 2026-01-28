import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';

const LoginButton = () => {
  const navigate = useNavigate();
  const { address } = useAccount();

  const handleLogin = () => {
    navigate('/login');
  };

  if (address) {
    return null; // Don't show login button if wallet is connected
  }

  return (
    <button
      onClick={handleLogin}
      className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors duration-300"
    >
      Login
    </button>
  );
};

export default LoginButton;
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = ({ onHomeClick, onFeaturesClick, onServicesClick, onContactClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMainPage = location.pathname === '/';
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="bg-white fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {isMainPage ? (
              <button onClick={onHomeClick} className="text-gray-900 font-bold text-xl">
                BAM
              </button>
            ) : (
              <Link to="/" className="text-gray-900 font-bold text-xl">
                BAM
              </Link>
            )}
          </div>
          
          <div className="flex items-center space-x-8">
            {isMainPage ? (
              <>
                <button onClick={onHomeClick} className="text-gray-600 hover:text-gray-900 text-sm">
                  Home
                </button>
                <button onClick={onFeaturesClick} className="text-gray-600 hover:text-gray-900 text-sm">
                  Features
                </button>
                <button onClick={onServicesClick} className="text-gray-600 hover:text-gray-900 text-sm">
                  Services
                </button>
                <Link to="/blog" className="text-gray-600 hover:text-gray-900 text-sm">
                  Blog
                </Link>
                <button onClick={onContactClick} className="text-gray-600 hover:text-gray-900 text-sm">
                  Contact
                </button>
              </>
            ) : (
              <>
                <Link to="/" className="text-gray-600 hover:text-gray-900 text-sm">
                  Home
                </Link>
                <Link to="/" className="text-gray-600 hover:text-gray-900 text-sm">
                  Features
                </Link>
                <Link to="/" className="text-gray-600 hover:text-gray-900 text-sm">
                  Services
                </Link>
                <Link to="/blog" className="text-gray-600 hover:text-gray-900 text-sm">
                  Blog
                </Link>
                <Link to="/" className="text-gray-600 hover:text-gray-900 text-sm">
                  Contact
                </Link>
              </>
            )}

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              {token ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-yellow-400 to-orange-500 rounded-md hover:from-yellow-500 hover:to-orange-600 transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 
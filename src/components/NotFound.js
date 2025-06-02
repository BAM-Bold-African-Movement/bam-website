import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            404
          </h1>
        </div>
        
        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Link
            to="/"
            className="inline-block w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
          >
            Go Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-block w-full sm:w-auto px-8 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
          >
            Go Back
          </button>
        </div>
        
        {/* Additional Navigation */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <p className="text-gray-500 mb-4">Or try one of these pages:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/blog"
              className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              Blog
            </Link>
            <Link
              to="/donations"
              className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              Donations
            </Link>
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              Login
            </Link>
          </div>
        </div>
        
        {/* Decorative Element */}
        <div className="mt-12 opacity-20">
          <svg
            className="w-32 h-32 mx-auto text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.5-5.291-3.706M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ activeSection, setActiveSection, sidebarOpen, setSidebarOpen }) => {
  const { isSuperAdmin } = useAuth();

  return (
    <div className={`fixed inset-y-0 left-0 bg-gray-800 w-64 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center justify-between h-20 px-6 bg-gray-900">
        <span className="text-xl font-bold text-white">BAM Admin</span>
        <button 
          onClick={() => setSidebarOpen(false)}
          className="text-gray-300 hover:text-white lg:hidden"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <nav className="mt-8 px-4">
        <button
          onClick={() => setActiveSection('blog')}
          className={`flex items-center w-full px-4 py-3 rounded-lg mb-2 ${
            activeSection === 'blog' 
              ? 'bg-yellow-500 text-white' 
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          Blog Management
        </button>

        <button
          onClick={() => setActiveSection('editor')}
          className={`flex items-center w-full px-4 py-3 rounded-lg mb-2 ${
            activeSection === 'editor' 
              ? 'bg-yellow-500 text-white' 
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Create Post
        </button>
        
        {/* Only show user management for super admin */}
        {isSuperAdmin() && (
          <button
            onClick={() => setActiveSection('users')}
            className={`flex items-center w-full px-4 py-3 rounded-lg ${
              activeSection === 'users' 
                ? 'bg-yellow-500 text-white' 
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            User Management
          </button>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
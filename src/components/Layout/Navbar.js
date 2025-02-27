import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('home');

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    if (location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        const navbarHeight = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }
  };

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['features', 'services', 'footer'];
      const scrollPosition = window.scrollY + 100; // Add offset for navbar

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;

          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            return;
          }
        }
      }

      // If we're at the top, set active to home
      if (scrollPosition < 300) {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-8 sm:px-10 lg:px-12">
        <div className="flex justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src="/assests/img/BAM transparent.png"
                alt="BAM Logo"
                className="h-16 w-auto"
                onError={(e) => {
                  console.error('Error loading logo image');
                  e.target.style.display = 'none';
                }}
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('home')}
              className={`text-gray-600 hover:text-gray-900 font-medium transition-all duration-300 hover:scale-105 py-2 px-3 relative
                ${activeSection === 'home' ? 'text-gray-900' : ''}`}
            >
              Home
              <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500 transform transition-transform duration-300 ${activeSection === 'home' ? 'scale-x-100' : 'scale-x-0'}`} />
            </button>
            
            <button 
              onClick={() => scrollToSection('features')}
              className={`text-gray-600 hover:text-gray-900 font-medium transition-all duration-300 hover:scale-105 py-2 px-3 relative
                ${activeSection === 'features' ? 'text-gray-900' : ''}`}
            >
              Features
              <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500 transform transition-transform duration-300 ${activeSection === 'features' ? 'scale-x-100' : 'scale-x-0'}`} />
            </button>
            
            <button 
              onClick={() => scrollToSection('services')}
              className={`text-gray-600 hover:text-gray-900 font-medium transition-all duration-300 hover:scale-105 py-2 px-3 relative
                ${activeSection === 'services' ? 'text-gray-900' : ''}`}
            >
              Services
              <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500 transform transition-transform duration-300 ${activeSection === 'services' ? 'scale-x-100' : 'scale-x-0'}`} />
            </button>
            
            <Link 
              to="/blog" 
              className={`text-gray-600 hover:text-gray-900 font-medium transition-all duration-300 hover:scale-105 py-2 px-3 relative
                ${location.pathname === '/blog' ? 'text-gray-900' : ''}`}
            >
              Blog
              <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500 transform transition-transform duration-300 ${location.pathname === '/blog' ? 'scale-x-100' : 'scale-x-0'}`} />
            </Link>
            
            <button 
              onClick={() => scrollToSection('footer')}
              className={`text-gray-600 hover:text-gray-900 font-medium transition-all duration-300 hover:scale-105 py-2 px-3 relative
                ${activeSection === 'footer' ? 'text-gray-900' : ''}`}
            >
              Contact
              <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500 transform transition-transform duration-300 ${activeSection === 'footer' ? 'scale-x-100' : 'scale-x-0'}`} />
            </button>
            
            <Link 
              to="/login"
              className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors duration-300 font-medium"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 
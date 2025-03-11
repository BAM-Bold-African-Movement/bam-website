import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAccount } from 'wagmi';
import LoginButton from '../Wallet/LoginButton';
import SignupButton from '../Wallet/SignupButton';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('home');
  const { address } = useAccount();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false);
    
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

  const NavItem = ({ onClick, active, children, className = '' }) => (
    <button 
      onClick={onClick}
      className={`text-gray-600 hover:text-gray-900 font-medium transition-all duration-300 hover:scale-105 py-2 px-3 relative w-full text-left md:text-center md:w-auto
        ${active ? 'text-gray-900' : ''} ${className}`}
    >
      {children}
      <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500 transform transition-transform duration-300 
        ${active ? 'scale-x-100' : 'scale-x-0'}`} />
    </button>
  );

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

          {/* Mobile Menu Toggle - ONLY visible on mobile screens */}
          <div className="flex items-center md:!hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop Navigation Links - ONLY visible on desktop */}
          <div className="hidden md:!flex items-center space-x-4 lg:space-x-8">
            <NavItem 
              onClick={() => scrollToSection('home')} 
              active={activeSection === 'home'}
            >
              Home
            </NavItem>
            
            <NavItem 
              onClick={() => scrollToSection('features')} 
              active={activeSection === 'features'}
            >
              Features
            </NavItem>
            
            <NavItem 
              onClick={() => scrollToSection('services')} 
              active={activeSection === 'services'}
            >
              Services
            </NavItem>
            
            <Link 
              to="/blog" 
              className={`text-gray-600 hover:text-gray-900 font-medium transition-all duration-300 hover:scale-105 py-2 px-3 relative
                ${location.pathname === '/blog' ? 'text-gray-900' : ''}`}
            >
              Blog
              <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500 transform transition-transform duration-300 ${location.pathname === '/blog' ? 'scale-x-100' : 'scale-x-0'}`} />
            </Link>
            
            <NavItem 
              onClick={() => scrollToSection('footer')} 
              active={activeSection === 'footer'}
            >
              Contact
            </NavItem>

            <div className="flex items-center gap-2 lg:gap-3">
               <LoginButton />
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown - Only visible when menu is open AND on mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-2 absolute left-0 right-0 bg-white shadow-lg border-t">
            <div className="flex flex-col items-start px-4">
              <NavItem 
                onClick={() => scrollToSection('home')} 
                active={activeSection === 'home'}
                className="py-3 border-b border-gray-100 w-full"
              >
                Home
              </NavItem>
              
              <NavItem 
                onClick={() => scrollToSection('features')} 
                active={activeSection === 'features'}
                className="py-3 border-b border-gray-100 w-full"
              >
                Features
              </NavItem>
              
              <NavItem 
                onClick={() => scrollToSection('services')} 
                active={activeSection === 'services'}
                className="py-3 border-b border-gray-100 w-full"
              >
                Services
              </NavItem>
              
              <Link 
                to="/blog" 
                className={`text-gray-600 hover:text-gray-900 font-medium transition-all duration-300 hover:scale-105 py-3 border-b border-gray-100 w-full relative
                  ${location.pathname === '/blog' ? 'text-gray-900' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blog
                <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500 transform transition-transform duration-300 ${location.pathname === '/blog' ? 'scale-x-100' : 'scale-x-0'}`} />
              </Link>
              
              <NavItem 
                onClick={() => scrollToSection('footer')} 
                active={activeSection === 'footer'}
                className="py-3 border-b border-gray-100 w-full mb-2"
              >
                Contact
              </NavItem>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 my-4 w-full">
                <SignupButton />
                {!address && <LoginButton />}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
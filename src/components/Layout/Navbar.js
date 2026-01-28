import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import WalletWrapper from '../Wallet/WalletWrapper';

const Navbar = () => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('home');
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
      className={`relative text-gray-300 hover:text-[#CA8A04] font-medium transition-all duration-300 py-2 px-3 w-full text-left md:text-center md:w-auto ${active ? 'text-[#CA8A04]' : ''} ${className}`}
    >
      {children}
      <span className={`absolute left-0 bottom-0 w-full h-0.5 bg-[#CA8A04] transition-transform duration-300 origin-left ${active ? 'scale-x-100' : 'scale-x-0'} group-hover:scale-x-100`}></span>
    </button>
  );

  return (
    <nav className="bg-gray-900 fixed w-full z-50">
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
              className="text-gray-300 hover:text-white"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop Navigation Links - ONLY visible on desktop */}
          <div className="hidden md:!flex items-center space-x-4 lg:space-x-8">
            <NavItem 
              onClick={() => scrollToSection('home')} 
              active={activeSection === 'home' && location.pathname === '/'}
            >
              Home
            </NavItem>
            
            <NavItem 
              onClick={() => scrollToSection('features')} 
              active={activeSection === 'features' && location.pathname === '/'}
            >
              Features
            </NavItem>
            
            <NavItem 
              onClick={() => scrollToSection('services')} 
              active={activeSection === 'services' && location.pathname === '/'}
            >
              Services
            </NavItem>
            
            <Link 
              to="/blog" 
              className={`relative text-gray-300 hover:text-[#CA8A04] font-medium transition-all duration-300 py-2 px-3 w-full md:w-auto ${location.pathname === '/blog' ? 'text-[#CA8A04]' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Blog
              <span className={`absolute left-0 bottom-0 w-full h-0.5 bg-[#CA8A04] transition-transform duration-300 origin-left ${location.pathname === '/blog' ? 'scale-x-100' : 'scale-x-0'} group-hover:scale-x-100`}></span>
            </Link>
            
            <Link 
              to="/contact" 
              className={`relative text-gray-300 hover:text-[#CA8A04] font-medium transition-all duration-300 py-2 px-3 w-full md:w-auto ${location.pathname === '/contact' ? 'text-[#CA8A04]' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
              <span className={`absolute left-0 bottom-0 w-full h-0.5 bg-[#CA8A04] transition-transform duration-300 origin-left ${location.pathname === '/contact' ? 'scale-x-100' : 'scale-x-0'} group-hover:scale-x-100`}></span>
            </Link>

            <div className="flex items-center gap-2 lg:gap-3 flex-nowrap">
              {/* Connect Wallet as Button */}
              <WalletWrapper
                className="bg-[#CA8A04] text-white px-6 py-2 rounded-md hover:bg-[#A16207] transition-colors duration-300 font-medium whitespace-nowrap"
                text="Connect Wallet"
                withWalletAggregator={true}
              />
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown - Only visible when menu is open AND on mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-2 absolute left-0 right-0 bg-gray-800 shadow-lg border-t border-gray-700">
            <div className="flex flex-col items-start px-4">
              <NavItem 
                onClick={() => scrollToSection('home')} 
                active={activeSection === 'home'}
                className="py-3 border-b border-gray-700 w-full"
              >
                Home
              </NavItem>
              
              <NavItem 
                onClick={() => scrollToSection('features')} 
                active={activeSection === 'features'}
                className="py-3 border-b border-gray-700 w-full"
              >
                Features
              </NavItem>
              
              <NavItem 
                onClick={() => scrollToSection('services')} 
                active={activeSection === 'services'}
                className="py-3 border-b border-gray-700 w-full"
              >
                Services
              </NavItem>
              
              <Link 
                to="/blog" 
                className={`relative text-gray-300 hover:text-[#CA8A04] font-medium transition-all duration-300 py-3 border-b border-gray-700 w-full relative
                  ${location.pathname === '/blog' ? 'text-[#CA8A04]' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blog
                <span className={`absolute left-0 bottom-0 w-full h-0.5 bg-[#CA8A04] transition-transform duration-300 origin-left ${location.pathname === '/blog' ? 'scale-x-100' : 'scale-x-0'} group-hover:scale-x-100`}></span>
              </Link>
              
              <Link 
                to="/contact" 
                className={`relative text-gray-300 hover:text-[#CA8A04] font-medium transition-all duration-300 py-3 border-b border-gray-700 w-full relative
                  ${location.pathname === '/contact' ? 'text-[#CA8A04]' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
                <span className={`absolute left-0 bottom-0 w-full h-0.5 bg-[#CA8A04] transition-transform duration-300 origin-left ${location.pathname === '/contact' ? 'scale-x-100' : 'scale-x-0'} group-hover:scale-x-100`}></span>
              </Link>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 my-4 w-full flex-nowrap">
                {/* Connect Wallet as Button */}
                <WalletWrapper
                  className="bg-[#CA8A04] text-white px-6 py-2 rounded-md hover:bg-[#A16207] transition-colors duration-300 font-medium w-full text-center whitespace-nowrap"
                  text="Connect Wallet"
                  withWalletAggregator={true}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
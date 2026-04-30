import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Info, Phone, Search, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentUser, userData } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home size={18} /> },
    { name: 'Properties', path: '/properties', icon: <Search size={18} /> },
    { name: 'About', path: '/about', icon: <Info size={18} /> },
    { name: 'Contact', path: '/contact', icon: <Phone size={18} /> },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md py-3 shadow-md border-b border-secondary/10' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <img src="/logo.png" alt="Swastik Properties Logo" className="h-12 md:h-16 w-auto transition-transform duration-300 group-hover:scale-105" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                className={`text-sm font-bold transition-colors hover:text-secondary ${location.pathname === link.path ? 'text-secondary border-b-2 border-secondary' : 'text-zinc-600'}`}
              >
                {link.name}
              </Link>
            ))}
            
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to={userData?.role === 'agent' ? '/dashboard/agent' : '/dashboard/buyer'}
                  className="bg-secondary text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-red-900 transition-all duration-300 flex items-center space-x-2 shadow-lg shadow-secondary/20"
                >
                  <User size={16} />
                  <span>Dashboard</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-zinc-400 hover:text-secondary transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-primary text-black px-6 py-2 rounded-full text-sm font-bold hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-primary/20 border border-primary/50"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-secondary" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className={`md:hidden absolute w-full bg-white/95 backdrop-blur-xl transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[100vh] border-b border-secondary/10 shadow-xl' : 'max-h-0'}`}>
        <div className="flex flex-col p-6 space-y-6">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-4 text-lg font-bold text-zinc-700 hover:text-secondary transition-colors"
            >
              <span className="text-secondary">{link.icon}</span>
              <span>{link.name}</span>
            </Link>
          ))}
          <hr className="border-zinc-100" />
          {currentUser ? (
            <>
              <Link 
                to={userData?.role === 'agent' ? '/dashboard/agent' : '/dashboard/buyer'}
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-4 text-lg font-bold text-secondary"
              >
                <User size={20} />
                <span>Dashboard</span>
              </Link>
              <button 
                onClick={() => { handleLogout(); setIsOpen(false); }}
                className="flex items-center space-x-4 text-lg font-bold text-red-600"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link 
              to="/login" 
              onClick={() => setIsOpen(false)}
              className="bg-secondary text-white text-center py-4 rounded-2xl font-bold shadow-lg shadow-secondary/20"
            >
              Login / Signup
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

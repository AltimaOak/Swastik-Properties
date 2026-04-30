import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-secondary pt-20 pb-10 text-white/70">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="Swastik Properties Logo" className="h-14 w-auto brightness-0 invert" />
            </Link>
            <p className="text-sm leading-relaxed font-medium">
              Your trusted partner in finding the perfect home, shop, or land. We bring premium real estate solutions to your fingertips with transparency and excellence.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/swastikproperties111?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-black transition-all duration-300">
                <FaInstagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-8">
            <h4 className="text-primary font-black uppercase tracking-[0.2em] text-xs">Quick Links</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/properties" className="hover:text-primary transition-colors">Properties</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Property Types */}
          <div className="space-y-8">
            <h4 className="text-primary font-black uppercase tracking-[0.2em] text-xs">Categories</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link to="/properties?type=Flat" className="hover:text-primary transition-colors">Modern Flats</Link></li>
              <li><Link to="/properties?type=Shop" className="hover:text-primary transition-colors">Commercial Shops</Link></li>
              <li><Link to="/properties?type=House" className="hover:text-primary transition-colors">Luxury Houses</Link></li>
              <li><Link to="/properties?type=Land" className="hover:text-primary transition-colors">Prime Land</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <h4 className="text-primary font-black uppercase tracking-[0.2em] text-xs">Contact Us</h4>
            <ul className="space-y-5 text-sm font-medium">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="text-primary shrink-0" />
                <span>Shop no.4, D3, Unnathi Woods Phase 4, Kasarvadavali, Thane West, Thane, Maharashtra 400615</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="text-primary shrink-0" />
                <span>+91 99875 65490</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="text-primary shrink-0" />
                <span>swastik_prop@rediffmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center text-[10px] font-black uppercase tracking-widest text-white/30">
          <p>© {new Date().getFullYear()} Swastik Properties. All rights reserved. Designed for Excellence.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

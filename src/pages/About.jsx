import React from 'react';
import { motion } from 'framer-motion';
import { Award, Target, Eye, User, MapPin } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#FDFDFD]">
      <div className="container mx-auto px-4 md:px-6">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-secondary mb-6 italic"
          >
            SWASTIK <span className="text-primary">PROPERTIES</span>
          </motion.h1>
          <p className="text-xl text-zinc-500 max-w-3xl mx-auto font-medium">
            Redefining the real estate experience through transparency, excellence, and a commitment to finding you the perfect space.
          </p>
        </div>

        {/* Mission/Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-10 rounded-[3rem] border border-zinc-100 shadow-premium"
          >
            <div className="w-14 h-14 bg-secondary/5 rounded-2xl flex items-center justify-center mb-6 text-secondary">
              <Target size={32} />
            </div>
            <h2 className="text-3xl font-black text-zinc-900 mb-4 italic">Our Mission</h2>
            <p className="text-zinc-500 leading-relaxed text-lg font-medium">
              To provide accessible, premium, and trustworthy real estate services that empower individuals to make the best property decisions for their future.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-10 rounded-[3rem] border border-zinc-100 shadow-premium"
          >
            <div className="w-14 h-14 bg-secondary/5 rounded-2xl flex items-center justify-center mb-6 text-secondary">
              <Eye size={32} />
            </div>
            <h2 className="text-3xl font-black text-zinc-900 mb-4 italic">Our Vision</h2>
            <p className="text-zinc-500 leading-relaxed text-lg font-medium">
              To become the most reliable and innovative real estate platform, known for our integrity and the high-quality properties we offer.
            </p>
          </motion.div>
        </div>

        {/* Founder/Owner Section */}
        <div className="bg-white rounded-[4rem] overflow-hidden border border-zinc-100 mb-24 shadow-premium">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="h-[400px] lg:h-full relative overflow-hidden">
              <img
                src="logo.png"
                alt="Founder"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent hidden lg:block"></div>
            </div>
            <div className="p-12 md:p-20 flex flex-col justify-center">
              <span className="text-secondary font-black uppercase tracking-[0.3em] text-sm mb-4">Meet the Visionary</span>
              <h2 className="text-4xl md:text-5xl font-black text-zinc-900 mb-6 italic">Shashiprabha Yadav</h2>
              <p className="text-zinc-500 text-lg leading-relaxed mb-8 font-medium italic">
                "Real estate is not just about buildings; it's about the dreams and aspirations tied to them. At Swastik Properties, we ensure every transaction is handled with the utmost care and professionalism."
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="flex items-center space-x-2 text-secondary font-black">
                  <Award size={24} />
                  <span>5+ Years Experience</span>
                </div>
                <div className="flex items-center space-x-2 text-secondary font-black">
                  <User size={24} />
                  <span>500+ Happy Clients</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Office Address */}
        <div className="text-center max-w-2xl mx-auto">
          <a 
            href="https://www.google.com/maps/search/Swastik+Properties+Shop+no.4,+Unnathi+Woods,+Thane" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-3 bg-white border border-zinc-100 px-8 py-4 rounded-full mb-8 text-secondary font-black shadow-premium hover:bg-secondary hover:text-white transition-all cursor-pointer"
          >
            <MapPin size={20} />
            <span>Visit Our Office</span>
          </a>
          <h3 className="text-3xl font-black text-zinc-900 mb-4 italic">Swastik Properties Office</h3>
          <p className="text-zinc-500 text-lg font-medium">
            Shop no.4, D3, Unnathi Woods Phase 4, <br />
            behind New Horizon School, Kasarvadavali, <br />
            Thane West, Thane, Maharashtra 400615
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;

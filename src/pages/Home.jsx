import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Shield, Star, Users, ArrowRight } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import Button from '../components/Button';
import { ref, query, orderByChild, limitToLast, get } from 'firebase/database';
import { db } from '../firebase/config';

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const snapshot = await get(ref(db, 'properties'));
        let properties = [];
        
        if (snapshot.exists()) {
          const data = snapshot.val();
          properties = Object.keys(data).map(key => ({ id: key, ...data[key] }));
          // Sort descending and take the last 3
          properties.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          properties = properties.slice(0, 3);
        }
        
        if (properties.length === 0) {
          // Fallback sample data
          setFeaturedProperties([
            {
              id: '1',
              title: 'Luxury 3BHK Flat',
              price: 8500000,
              location: 'Kasarvadavali, Thane',
              type: 'Flat',
              images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800']
            },
            {
              id: '2',
              title: 'Premium Commercial Shop',
              price: 4500000,
              location: 'Ghodbunder Road, Thane',
              type: 'Shop',
              images: ['https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&q=80&w=800']
            },
            {
              id: '3',
              title: 'Spacious 4BHK Villa',
              price: 15000000,
              location: 'Hiranandani Estate, Thane',
              type: 'House',
              images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800']
            }
          ]);
        } else {
          setFeaturedProperties(properties);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="overflow-hidden bg-[#FDFDFD]">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000" 
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]"></div>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-secondary font-black uppercase tracking-[0.3em] text-sm mb-4 block">Premium Real Estate</span>
            <h1 className="text-5xl md:text-8xl font-black text-secondary mb-6 tracking-tighter leading-tight drop-shadow-sm">
              SWASTIK <span className="text-primary italic">PROPERTIES</span>
            </h1>
            <p className="text-xl md:text-2xl text-zinc-800 mb-10 max-w-2xl mx-auto font-bold italic">
              Buy | Sell | Rent — Your journey to the perfect property starts here with trust and elegance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/properties">
                <Button className="px-10 py-4 text-lg">Browse Properties</Button>
              </Link>
              <Link to="/contact">
                <Button variant="secondary" className="px-10 py-4 text-lg">Contact Agent</Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-secondary/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-zinc-900 mb-4 tracking-tight">Featured <span className="text-secondary">Listings</span></h2>
              <p className="text-zinc-500 max-w-lg font-medium">Handpicked premium properties that offer the best value and luxury for your investment.</p>
            </div>
            <Link to="/properties" className="text-secondary flex items-center space-x-2 font-black hover:translate-x-2 transition-transform">
              <span>View All Properties</span>
              <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {loading ? (
              [1, 2, 3].map(n => (
                <div key={n} className="h-[400px] bg-zinc-100 animate-pulse rounded-3xl"></div>
              ))
            ) : (
              featuredProperties.map(prop => (
                <PropertyCard key={prop.id} property={prop} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-zinc-50">
        <div className="container mx-auto px-4 md:px-6 text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-zinc-900 mb-4">Why Choose <span className="text-secondary">Swastik?</span></h2>
          <p className="text-zinc-500 max-w-2xl mx-auto font-medium">We provide a seamless and transparent real estate experience built on years of expertise and trust.</p>
        </div>

        <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {[
            { icon: <Shield className="text-secondary" size={40} />, title: "Trusted Platform", desc: "Every property listing is verified by our experts to ensure peace of mind." },
            { icon: <Star className="text-secondary" size={40} />, title: "Premium Selection", desc: "We only list properties that meet our high standards of quality and value." },
            { icon: <Users className="text-secondary" size={40} />, title: "Expert Agents", desc: "Our experienced agents are here to guide you through every step of the process." }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="p-10 bg-white border border-zinc-100 rounded-3xl hover:border-secondary/20 transition-all shadow-premium"
            >
              <div className="mb-6 flex justify-center">{feature.icon}</div>
              <h3 className="text-xl font-bold text-zinc-900 mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-zinc-50 rounded-[3rem] p-12 md:p-20 relative overflow-hidden border border-zinc-100">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-zinc-900 mb-10">What Our <span className="text-secondary">Clients Say</span></h2>
                <div className="space-y-8">
                  {[
                    { name: "Aditya Yadav", initials: "AY", role: "Verified Client", msg: "I had a fantastic experience with Swastik property. The staff was knowledgeable, professional, and always willing to help." },
                    { name: "Manish Chavan", initials: "MC", role: "Home Buyer", msg: "Great experience 👌 Highly recommended for property deals in Thane." },
                    { name: "Suryaprakash Yadav", initials: "SY", role: "Local Guide", msg: "Trustworthy and transparent services. One of the best real estate agents I've worked with." }
                  ].map((t, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
                      <p className="text-zinc-600 italic mb-4 font-medium">"{t.msg}"</p>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white font-bold">{t.initials}</div>
                        <div>
                          <p className="text-zinc-900 font-bold text-sm">{t.name}</p>
                          <p className="text-zinc-400 text-xs font-bold">{t.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="hidden lg:block">
                <img 
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800" 
                  alt="Modern House"
                  className="rounded-3xl shadow-premium rotate-2 border-8 border-white"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight tracking-tighter">Ready to Find Your <br />Next Big Investment?</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/properties">
              <Button className="px-12 py-5 text-xl bg-white text-secondary hover:bg-primary hover:text-black border-none shadow-2xl">Start Exploring</Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="px-12 py-5 text-xl border-white text-white hover:bg-white hover:text-secondary">Contact Us</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

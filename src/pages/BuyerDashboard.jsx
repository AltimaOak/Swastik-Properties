import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { ref, query, orderByChild, equalTo, get } from 'firebase/database';
import { motion } from 'framer-motion';
import { 
  Heart, 
  MessageSquare, 
  User, 
  Clock, 
  ChevronRight,
  ExternalLink,
  MapPin,
  IndianRupee
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const BuyerDashboard = () => {
  const { currentUser, userData } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInquiries = async () => {
      if (!currentUser) return;
      try {
        const snapshot = await get(ref(db, 'inquiries'));
        if (snapshot.exists()) {
          const data = snapshot.val();
          let allInqs = Object.keys(data).map(key => ({ id: key, ...data[key] }));
          let userInqs = allInqs.filter(i => i.buyerId === currentUser.uid);
          userInqs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setInquiries(userInqs);
        } else {
          setInquiries([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInquiries();
  }, [currentUser]);

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#FDFDFD]">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Profile Overview */}
        <div className="bg-white rounded-[3rem] border border-zinc-100 shadow-premium p-8 md:p-12 mb-12 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
          
          <div className="w-24 h-24 bg-primary rounded-[2rem] flex items-center justify-center text-black rotate-3 shadow-xl shadow-primary/20">
            <User size={48} />
          </div>
          <div className="text-center md:text-left relative z-10">
            <h1 className="text-4xl font-black text-secondary italic">{userData?.name || 'User'}</h1>
            <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-xs mt-2">{userData?.email}</p>
            <div className="flex items-center justify-center md:justify-start space-x-4 mt-6">
              <span className="bg-secondary text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-md">Buyer</span>
              <span className="text-zinc-400 text-xs font-bold">Member since {new Date(userData?.createdAt || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Inquiry History */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-secondary italic flex items-center">
                <Clock className="mr-3 text-primary" />
                <span>My Inquiry History</span>
              </h2>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(n => <div key={n} className="h-32 bg-zinc-50 border border-zinc-100 animate-pulse rounded-[2rem]"></div>)}
              </div>
            ) : inquiries.length > 0 ? (
              <div className="space-y-4">
                {inquiries.map((inq, idx) => (
                  <motion.div 
                    key={inq.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white p-6 rounded-[2rem] border border-zinc-100 hover:shadow-premium transition-all group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-secondary font-black text-lg group-hover:text-red-900 transition-colors">{inq.propertyTitle || 'Property Inquiry'}</h4>
                        <p className="text-zinc-400 text-[10px] uppercase font-black tracking-widest mt-1">{new Date(inq.createdAt).toLocaleDateString()}</p>
                      </div>
                      <Link to={`/property/${inq.propertyId}`} className="p-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-500 hover:bg-secondary hover:text-white hover:border-secondary transition-colors">
                        <ExternalLink size={18} />
                      </Link>
                    </div>
                    <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 text-zinc-600 text-sm italic font-medium">
                      "{inq.message}"
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-zinc-50 rounded-[3rem] p-12 text-center border border-dashed border-zinc-200">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <MessageSquare className="text-zinc-300" size={32} />
                </div>
                <p className="text-zinc-500 font-medium">You haven't made any inquiries yet.</p>
                <Link to="/properties" className="text-secondary font-black mt-6 inline-block hover:underline underline-offset-4 tracking-widest uppercase text-xs">Start Browsing</Link>
              </div>
            )}
          </div>

          {/* Quick Shortcuts */}
          <div className="space-y-8">
            <h2 className="text-2xl font-black text-secondary italic">Shortcuts</h2>
            <div className="grid grid-cols-1 gap-4">
              <Link to="/properties" className="bg-white p-6 rounded-[2rem] border border-zinc-100 shadow-sm hover:shadow-premium transition-all flex items-center justify-between group">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-secondary"><MapPin size={24} /></div>
                  <span className="font-black text-secondary">Find Properties</span>
                </div>
                <ChevronRight className="text-zinc-400 group-hover:text-secondary transition-colors" />
              </Link>
              
              <div className="bg-secondary p-8 rounded-[2.5rem] mt-8 shadow-xl shadow-secondary/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 text-white/5 group-hover:scale-110 transition-transform -mr-4 -mt-4">
                   <MessageSquare size={100} />
                </div>
                <h3 className="text-white font-black italic mb-4 relative z-10 text-xl">Need Help?</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-8 relative z-10 font-medium">Our dedicated support team is here to assist you in your property search.</p>
                <Link to="/contact" className="relative z-10">
                  <Button className="w-full bg-white text-secondary hover:bg-primary hover:text-black transition-all">Contact Support</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;


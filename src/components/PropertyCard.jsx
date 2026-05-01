import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Home, IndianRupee, ArrowUpRight, Heart, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ref, push, set } from 'firebase/database';
import { db } from '../firebase/config';

const PropertyCard = ({ property }) => {
  const { id, title, price, location, type, images, bhk, agentId } = property;
  const { currentUser } = useAuth();
  const [liked, setLiked] = useState(false);
  const [liking, setLiking] = useState(false);

  const mainImage = images && images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800';

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
      alert("Please login to express interest.");
      return;
    }

    if (liked) return;

    setLiking(true);
    try {
      const interestRef = push(ref(db, 'inquiries'));
      await set(interestRef, {
        propertyId: id,
        buyerId: currentUser.uid,
        buyerName: currentUser.displayName || 'Anonymous User',
        buyerEmail: currentUser.email,
        message: `I am interested in this ${bhk || ''} ${type}.`,
        contact: currentUser.email,
        createdAt: new Date().toISOString(),
        propertyTitle: title,
        agentId: agentId || '',
        type: 'interest'
      });
      setLiked(true);
    } catch (err) {
      console.error("Error liking property:", err);
    } finally {
      setLiking(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="group bg-white rounded-3xl overflow-hidden border border-zinc-100 hover:border-secondary/20 transition-all duration-300 shadow-premium relative"
    >
      <button 
        onClick={handleLike}
        disabled={liking || liked}
        className={`absolute top-4 right-4 z-10 p-3 rounded-2xl backdrop-blur-md transition-all shadow-lg ${liked ? 'bg-primary text-secondary' : 'bg-white/80 text-secondary hover:bg-primary'}`}
      >
        {liking ? <Loader2 size={20} className="animate-spin" /> : <Heart size={20} fill={liked ? "currentColor" : "none"} />}
      </button>

      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={mainImage} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 flex flex-col space-y-2">
          <span className="bg-primary text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg w-fit">
            {type}
          </span>
          {property.purpose && (
            <span className="bg-secondary text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg w-fit">
              For {property.purpose}
            </span>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
          <Link 
            to={`/property/${id}`}
            className="w-full bg-secondary text-white py-3 rounded-2xl font-bold flex items-center justify-center space-x-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl"
          >
            <span>View Details</span>
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-zinc-900 line-clamp-1 group-hover:text-secondary transition-colors">{title}</h3>
          </div>
          <div className="flex items-center text-zinc-500 text-sm mt-2">
            <MapPin size={16} className="mr-1.5 text-secondary" />
            <span className="line-clamp-1">{location}</span>
          </div>
          {bhk && (
            <p className="text-[10px] font-black uppercase tracking-widest text-secondary/50 mt-2">{bhk}</p>
          )}
        </div>

        <div className="flex items-center justify-between pt-5 border-t border-zinc-50">
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-400 uppercase font-black tracking-widest leading-none mb-1">Total Price</span>
            <div className="flex items-center text-secondary font-black text-xl">
              <IndianRupee size={18} />
              <span>{price.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <div className="bg-zinc-50 p-2 rounded-xl text-secondary">
            <Home size={18} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;

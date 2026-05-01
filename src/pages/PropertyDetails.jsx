import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ref, get, child, push, set } from 'firebase/database';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  IndianRupee, 
  Calendar, 
  Home, 
  Maximize, 
  Phone, 
  MessageCircle, 
  Send, 
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import emailjs from '@emailjs/browser';

const PropertyDetails = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [inquiry, setInquiry] = useState({ message: '', contact: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const snapshot = await get(child(ref(db), `properties/${id}`));
        if (snapshot.exists()) {
          setProperty({ id: snapshot.key, ...snapshot.val() });
        } else {
          // Placeholder for demo if id is 1, 2, or 3 from home page
          const placeholders = {
            '1': { title: 'Luxury 3BHK Flat', price: 8500000, location: 'City Center, Mumbai', type: 'Flat', description: 'Experience luxury living in this spacious 3BHK flat located in the heart of Mumbai. Features modern amenities, premium finishes, and breathtaking city views.', images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200'], size: '1500 sqft' },
            '2': { title: 'Premium Commercial Shop', price: 4500000, location: 'Market Road, Pune', type: 'Shop', description: 'Highly visible commercial shop ideal for retail or office space. Located in a high-footfall area with excellent connectivity.', images: ['https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&q=80&w=1200'], size: '500 sqft' }
          };
          if (placeholders[id]) setProperty(placeholders[id]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Please login to send an inquiry.");
      return;
    }
    setSubmitting(true);
    try {
      // 1. Save to Firebase
      const newInquiryRef = push(ref(db, 'inquiries'));
      await set(newInquiryRef, {
        propertyId: id,
        buyerId: currentUser.uid,
        message: inquiry.message,
        contact: inquiry.contact,
        createdAt: new Date().toISOString(),
        propertyTitle: property.title
      });

      // 2. Send Email via EmailJS
      const templateParams = {
        from_name: currentUser.displayName || 'Buyer',
        from_email: inquiry.contact, // Contact info provided
        subject: `New Inquiry: ${property.title}`,
        message: inquiry.message,
        property_title: property.title,
        to_email: 'swastik_prop@rediffmail.com'
      };

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_id', 
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_id',
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'public_key'
      );

      setSubmitted(true);
    } catch (err) {
      console.error('Email/Firebase Error:', err);
      alert('Failed to send inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen pt-24 bg-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
    </div>
  );

  if (!property) return (
    <div className="min-h-screen pt-24 bg-black flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold text-white mb-4">Property Not Found</h2>
      <Link to="/properties" className="text-primary hover:underline">Back to Listings</Link>
    </div>
  );

  const images = property.images && property.images.length > 0 
    ? property.images 
    : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200'];

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#FDFDFD]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Gallery & Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery Carousel */}
            <div className="relative aspect-video rounded-[3rem] overflow-hidden group shadow-premium border border-zinc-100">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={images[currentImageIndex]}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              
              {images.length > 1 && (
                <>
                  <button 
                    onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                    className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 backdrop-blur-md text-secondary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:bg-secondary hover:text-white"
                  >
                    <ChevronLeft size={28} />
                  </button>
                  <button 
                    onClick={() => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 backdrop-blur-md text-secondary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:bg-secondary hover:text-white"
                  >
                    <ChevronRight size={28} />
                  </button>
                  
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
                    {images.map((_, idx) => (
                      <div 
                        key={idx} 
                        className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentImageIndex ? 'bg-secondary w-8' : 'bg-white/50 backdrop-blur-sm'}`}
                      ></div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Title & Stats */}
            <div className="bg-white p-10 rounded-[3rem] border border-zinc-100 shadow-premium">
              <div className="flex flex-col md:flex-row justify-between md:items-start gap-6 mb-10">
                <div>
                  <h1 className="text-3xl md:text-5xl font-black text-secondary mb-3 tracking-tight">{property.title}</h1>
                  <div className="flex items-center text-zinc-500">
                    <MapPin size={22} className="text-secondary mr-2" />
                    <span className="text-xl font-medium">{property.location}</span>
                  </div>
                </div>
                <div className="bg-primary text-black px-8 py-4 rounded-3xl shadow-xl shadow-primary/10">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] block leading-none mb-2 opacity-60">Total Investment</span>
                  <div className="flex items-center text-3xl font-black italic">
                    <IndianRupee size={28} />
                    <span>{property.price.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-10 border-y border-zinc-100">
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-400 uppercase font-black tracking-widest mb-2">Category</span>
                  <div className="flex items-center text-secondary font-black">
                    <Home size={20} className="mr-2" />
                    <span>{property.type}</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-400 uppercase font-black tracking-widest mb-2">Built Area</span>
                  <div className="flex items-center text-secondary font-black">
                    <Maximize size={20} className="mr-2" />
                    <span>{property.size || 'N/A'}</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-400 uppercase font-black tracking-widest mb-2">Published</span>
                  <div className="flex items-center text-secondary font-black">
                    <Calendar size={20} className="mr-2" />
                    <span>{new Date(property.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-400 uppercase font-black tracking-widest mb-2">Purpose</span>
                  <div className="flex items-center text-secondary font-black">
                    <TrendingUp size={20} className="mr-2" />
                    <span>For {property.purpose || 'Buy'}</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-400 uppercase font-black tracking-widest mb-2">Reference</span>
                  <div className="flex items-center text-secondary font-black italic">
                    <span>#SP-{id.slice(0, 5).toUpperCase()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-2xl font-black text-secondary mb-4 italic">Property Description</h3>
                <p className="text-zinc-500 leading-relaxed text-lg font-medium">
                  {property.description}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Contact & Inquiry */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-secondary p-10 rounded-[3rem] shadow-xl shadow-secondary/10 text-white">
              <h3 className="text-xl font-black mb-8 italic">Interested? Contact Agent</h3>
              <div className="grid grid-cols-2 gap-4">
                <a href="tel:+919987565490" className="flex flex-col items-center justify-center p-5 bg-white/10 rounded-2xl hover:bg-primary hover:text-black transition-all group border border-white/5">
                  <Phone size={28} className="text-primary group-hover:text-black mb-3" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Call Now</span>
                </a>
                <a href={`https://wa.me/919987565490?text=Hi, I am interested in ${property.title}`} className="flex flex-col items-center justify-center p-5 bg-white/10 rounded-2xl hover:bg-[#25D366] hover:text-white transition-all group border border-white/5">
                  <MessageCircle size={28} className="text-primary group-hover:text-white mb-3" />
                  <span className="text-[10px] font-black uppercase tracking-widest">WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Inquiry Form */}
            <div className="bg-white p-10 rounded-[3rem] border border-zinc-100 shadow-premium relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
              
              <h3 className="text-xl font-black text-secondary mb-8">Send Inquiry</h3>
              {submitted ? (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-green-50 border border-green-100 p-8 rounded-3xl text-center"
                >
                  <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                  <h4 className="text-zinc-900 font-black mb-2">Inquiry Sent!</h4>
                  <p className="text-zinc-500 text-sm font-medium">Our agent will contact you shortly.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-6 relative z-10">
                  <Input 
                    label="Phone / Email"
                    placeholder="How should we reach you?"
                    value={inquiry.contact}
                    onChange={(e) => setInquiry({ ...inquiry, contact: e.target.value })}
                    required
                  />
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700">Message</label>
                    <textarea 
                      rows="5"
                      className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 px-4 py-4 rounded-2xl focus:outline-none focus:border-secondary transition-all placeholder:text-zinc-400 shadow-sm"
                      placeholder="I'm interested in this property..."
                      value={inquiry.message}
                      onChange={(e) => setInquiry({ ...inquiry, message: e.target.value })}
                      required
                    ></textarea>
                  </div>
                  <Button type="submit" variant="secondary" className="w-full py-5 text-lg flex items-center justify-center space-x-2 shadow-xl shadow-secondary/20" disabled={submitting}>
                    {submitting ? 'Sending...' : (
                      <>
                        <span>Submit Inquiry</span>
                        <Send size={20} />
                      </>
                    )}
                  </Button>
                  {!currentUser && (
                    <p className="text-[10px] text-zinc-400 text-center font-bold uppercase tracking-widest">Login required to send inquiries</p>
                  )}
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;

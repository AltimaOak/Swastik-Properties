import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, MessageSquare, CheckCircle } from 'lucide-react';
import { db } from '../firebase/config';
import { ref, push, set } from 'firebase/database';
import Button from '../components/Button';
import Input from '../components/Input';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // 1. Save to Firebase (Existing logic)
      const newMsgRef = push(ref(db, 'contact_messages'));
      await set(newMsgRef, {
        ...formData,
        createdAt: new Date().toISOString()
      });

      // 2. Send Email via EmailJS
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_email: 'swastik_prop@rediffmail.com'
      };

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_id', 
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_id',
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'public_key'
      );

      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Email/Firebase Error:', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: <Phone />, label: 'Phone', value: '+91 99875 65490', sub: 'Mon-Sun 9:30am to 8:30pm' },
    { icon: <Mail />, label: 'Email', value: 'swastik_prop@rediffmail.com', sub: '24/7 Online Support' },
    { icon: <MapPin />, label: 'Location', value: 'Shop no.4, Unnathi Woods, Thane', sub: 'Thane West, Maharashtra' }
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#FDFDFD]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black text-secondary mb-6 tracking-tighter">GET IN <span className="text-primary italic">TOUCH</span></h1>
          <p className="text-zinc-500 max-w-2xl mx-auto font-medium">Have questions? We're here to help you find your next premium property.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            {contactInfo.map((info, idx) => {
              const isLink = info.label === 'Phone' || info.label === 'Email';
              const href = info.label === 'Phone' 
                ? `tel:${info.value.replace(/\s/g, '')}` 
                : info.label === 'Email' 
                  ? `mailto:${info.value}` 
                  : null;

              const CardContent = (
                <motion.div 
                  whileHover={{ x: 10 }}
                  className="bg-white p-8 rounded-[2rem] border border-zinc-100 flex items-start space-x-6 shadow-premium h-full"
                >
                  <div className="w-12 h-12 bg-secondary/5 rounded-xl flex items-center justify-center text-secondary shrink-0 pointer-events-none">
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="text-secondary/50 text-[10px] font-black uppercase tracking-widest mb-1">{info.label}</h3>
                    <p className="text-zinc-900 font-bold text-lg group-hover:text-secondary transition-colors">{info.value}</p>
                    <p className="text-zinc-400 text-sm mt-1 font-medium">{info.sub}</p>
                  </div>
                </motion.div>
              );

              return isLink ? (
                <a key={idx} href={href} className="block group">
                  {CardContent}
                </a>
              ) : (
                <div key={idx}>
                  {CardContent}
                </div>
              );
            })}

            {/* Social Link Box */}
            <div className="bg-primary p-8 rounded-[2rem] text-black shadow-lg shadow-primary/20">
              <h3 className="font-black text-xl mb-4 italic">Chat with an expert</h3>
              <p className="text-black/70 text-sm mb-6 font-bold">Join our growing community and stay updated with the latest listings.</p>
              <a href="https://wa.me/919987565490" className="flex items-center space-x-2 bg-secondary text-white px-6 py-3 rounded-xl font-bold w-fit hover:scale-105 transition-transform shadow-xl shadow-secondary/20">
                <MessageSquare size={18} />
                <span>Open WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-zinc-100 relative overflow-hidden shadow-premium">
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
              
              <h2 className="text-3xl font-black text-secondary mb-8 italic">Send a Message</h2>
              
              {submitted ? (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="py-12 text-center"
                >
                  <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-zinc-900 mb-2">Message Received!</h3>
                  <p className="text-zinc-500">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-8 text-secondary font-bold underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input 
                      label="Your Name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                    <Input 
                      label="Email Address"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                  <Input 
                    label="Subject"
                    placeholder="Regarding listing #SP-123"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    required
                  />
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-zinc-700">Message</label>
                    <textarea 
                      rows="6"
                      className="w-full bg-white border border-zinc-200 text-zinc-900 px-4 py-4 rounded-2xl focus:outline-none focus:border-secondary/50 transition-all placeholder:text-zinc-400 shadow-sm"
                      placeholder="How can we help you?"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      required
                    ></textarea>
                  </div>
                  <Button type="submit" variant="secondary" className="w-full py-5 text-lg flex items-center justify-center space-x-2" disabled={submitting}>
                    <span>{submitting ? 'Sending...' : 'Send Message'}</span>
                    {!submitting && <Send size={20} />}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Map Embed Placeholder */}
        <div className="h-[500px] w-full bg-zinc-50 rounded-[3rem] overflow-hidden border border-zinc-200 relative shadow-premium">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3766.082!2d72.9745817!3d19.2673223!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDE2JzAyLjQiTiA3MsKwNTgnMjguNSJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy"
            className="w-full h-full"
          ></iframe>
          <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-zinc-100 max-w-xs">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-white">
                <MapPin size={20} />
              </div>
              <h4 className="font-black text-secondary uppercase tracking-widest text-sm">Our Location</h4>
            </div>
            <p className="text-zinc-600 text-sm font-bold mb-1">Unnathi Woods Phase 4,</p>
            <p className="text-zinc-500 text-xs">Kasarvadavali, Thane West, Maharashtra 400615</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

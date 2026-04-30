import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import Input from '../components/Input';
import Button from '../components/Button';
import { motion } from 'framer-motion';
import { UserPlus, User, Mail, Lock, AlertCircle } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'buyer' // default role
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Save user to Realtime Database
      set(ref(db, `users/${user.uid}`), {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        createdAt: new Date().toISOString()
      }).catch(e => console.warn("Database sync will happen later:", e));

      // Immediate navigation
      if (formData.role === 'agent') navigate('/dashboard/agent');
      else navigate('/dashboard/buyer');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-[#FDFDFD] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -ml-48 -mt-48"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-48 -mb-48"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md px-6 relative z-10"
      >
        <div className="bg-white border border-zinc-100 p-10 rounded-[3rem] shadow-premium">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-primary rounded-[2rem] flex items-center justify-center mx-auto mb-6 -rotate-6 shadow-xl">
              <UserPlus className="text-black" size={36} />
            </div>
            <h2 className="text-3xl font-black text-secondary italic">Create Account</h2>
            <p className="text-zinc-400 mt-2 font-medium">Join the Swastik family today</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl flex items-center text-sm font-bold">
                <AlertCircle size={18} className="mr-2" />
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <Input 
                  name="name"
                  placeholder="Full Name" 
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-12"
                  required
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <Input 
                  name="email"
                  type="email" 
                  placeholder="Email Address" 
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-12"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <Input 
                  name="password"
                  type="password" 
                  placeholder="Password" 
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-secondary/40 ml-1">Join as:</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'buyer' })}
                  className={`py-4 rounded-2xl border text-sm font-black uppercase tracking-widest transition-all ${formData.role === 'buyer' ? 'bg-secondary text-white border-secondary shadow-lg shadow-secondary/20' : 'bg-white text-zinc-400 border-zinc-100 hover:border-zinc-200'}`}
                >
                  Buyer
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'agent' })}
                  className={`py-4 rounded-2xl border text-sm font-black uppercase tracking-widest transition-all ${formData.role === 'agent' ? 'bg-secondary text-white border-secondary shadow-lg shadow-secondary/20' : 'bg-white text-zinc-400 border-zinc-100 hover:border-zinc-200'}`}
                >
                  Agent
                </button>
              </div>
            </div>

            <Button type="submit" variant="secondary" className="w-full py-5 text-lg mt-4 shadow-xl shadow-secondary/20" disabled={loading}>
              {loading ? 'Creating Account...' : 'Get Started'}
            </Button>
          </form>

          <div className="mt-10 text-center text-sm font-medium text-zinc-400">
            Already have an account? {' '}
            <Link to="/login" className="text-secondary font-black hover:underline underline-offset-4">Sign In</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;

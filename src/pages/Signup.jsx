import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import Input from '../components/Input';
import Button from '../components/Button';
import { motion } from 'framer-motion';
import { UserPlus, User, Mail, Lock, AlertCircle, Eye, EyeOff, Sparkles } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'buyer' // default role
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirectUrl = searchParams.get('redirect');
  const isClientProfileRedirect = redirectUrl === '/client-profile';

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

      // Update Firebase Auth user displayName immediately
      try {
        await updateProfile(user, { displayName: formData.name.trim() });
      } catch (profileErr) {
        console.warn("Could not set displayName on user:", profileErr);
      }

      // Save user to Realtime Database
      try {
        await set(ref(db, `users/${user.uid}`), {
          uid: user.uid,
          name: formData.name.trim(),
          email: formData.email.trim(),
          role: formData.role,
          createdAt: new Date().toISOString()
        });
      } catch (e) {
        console.warn("Database sync will happen later:", e);
      }

      // If a redirect URL was specified (e.g. /client-profile), navigate there with prefilled data
      if (redirectUrl) {
        navigate(redirectUrl, { 
          state: { 
            ...(location.state || {}),
            prefillName: formData.name.trim(),
            prefillEmail: formData.email.trim()
          } 
        });
      } else if (formData.role === 'agent') {
        navigate('/dashboard/agent');
      } else {
        navigate('/dashboard/buyer');
      }
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
        <div className="bg-white border border-zinc-100 p-8 md:p-10 rounded-[3rem] shadow-premium">
          {/* Client Profile Step 1 Indicator Banner */}
          {isClientProfileRedirect && (
            <div className="mb-8 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 p-5 rounded-2xl text-center shadow-sm">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-2">
                <Sparkles size={12} className="text-primary" />
                <span>Step 1 of 2</span>
              </div>
              <h3 className="text-base font-black text-secondary">
                Create Account to Fill Client Profile
              </h3>
              <p className="text-xs text-zinc-600 mt-1.5 leading-relaxed">
                Please create your account first. Once signed up, you'll immediately fill out your property requirements and connect with our consultants.
              </p>
            </div>
          )}

          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-primary rounded-[2rem] flex items-center justify-center mx-auto mb-6 -rotate-6 shadow-xl">
              <UserPlus className="text-black" size={36} />
            </div>
            <h2 className="text-3xl font-black text-secondary italic">Create Account</h2>
            <p className="text-zinc-400 mt-2 font-medium">
              {isClientProfileRedirect ? 'Join to submit your property requirement' : 'Join the Swastik family today'}
            </p>
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
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="Password" 
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-12 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-secondary transition-colors focus:outline-none cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
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
              {loading ? 'Creating Account...' : isClientProfileRedirect ? 'Sign Up & Continue to Form' : 'Get Started'}
            </Button>
          </form>

          <div className="mt-10 text-center text-sm font-medium text-zinc-400">
            Already have an account? {' '}
            <Link 
              to={redirectUrl ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : "/login"} 
              state={location.state}
              className="text-secondary font-black hover:underline underline-offset-4"
            >
              Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;

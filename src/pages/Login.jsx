import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ref, get, child } from 'firebase/database';
import Input from '../components/Input';
import Button from '../components/Button';
import { motion } from 'framer-motion';
import { LogIn, Lock, Mail, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Fetch user role to redirect properly
      try {
        const userSnapshot = await get(child(ref(db), `users/${userCredential.user.uid}`));
        
        if (userSnapshot.exists()) {
          const role = userSnapshot.val().role;
          if (role === 'agent') navigate('/dashboard/agent');
          else navigate('/dashboard/buyer');
          return;
        }
      } catch (err) {
        console.warn("Database role fetch failed:", err);
      }
      
      // Fallback: If we can't get the role or it doesn't exist, go to home
      navigate('/');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-[#FDFDFD] relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -ml-48 -mt-48"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-48 -mb-48"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md px-6 relative z-10"
      >
        <div className="bg-white border border-zinc-100 p-10 rounded-[3rem] shadow-premium">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-secondary rounded-[2rem] flex items-center justify-center mx-auto mb-6 rotate-6 shadow-xl">
              <LogIn className="text-white" size={36} />
            </div>
            <h2 className="text-3xl font-black text-secondary italic">Welcome Back</h2>
            <p className="text-zinc-400 mt-2 font-medium">Access your Swastik account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl flex items-center text-sm font-bold">
                <AlertCircle size={18} className="mr-2" />
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <Input 
                  type="email" 
                  placeholder="Email Address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <Input 
                  type="password" 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-secondary/60">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="rounded border-zinc-300 bg-white text-secondary focus:ring-secondary" />
                <span>Remember</span>
              </label>
              <Link to="/forgot-password" title="Coming Soon">Forgot Password?</Link>
            </div>

            <Button type="submit" variant="secondary" className="w-full py-5 text-lg shadow-xl shadow-secondary/20" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-10 text-center text-sm font-medium text-zinc-400">
            Don't have an account? {' '}
            <Link to="/signup" className="text-secondary font-black hover:underline underline-offset-4">Create Account</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

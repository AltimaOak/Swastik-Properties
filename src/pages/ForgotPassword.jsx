import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase/config';
import { sendPasswordResetEmail } from 'firebase/auth';
import Input from '../components/Input';
import Button from '../components/Button';
import { motion } from 'framer-motion';
import { KeyRound, Mail, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (err) {
      console.error("Password reset error details:", err);
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.');
      } else {
        setError(err.message || 'Failed to send password reset email. Please try again.');
      }
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
          
          {/* Back button */}
          <Link 
            to="/login" 
            className="inline-flex items-center text-xs font-black uppercase tracking-widest text-secondary hover:text-secondary/70 transition-colors mb-6 group cursor-pointer"
          >
            <ArrowLeft size={16} className="mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Login
          </Link>

          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-secondary rounded-[2rem] flex items-center justify-center mx-auto mb-6 -rotate-6 shadow-xl">
              <KeyRound className="text-white" size={36} />
            </div>
            <h2 className="text-3xl font-black text-secondary italic">Reset Password</h2>
            <p className="text-zinc-400 mt-2 font-medium">
              We'll send you instructions to reset your password.
            </p>
          </div>

          {success ? (
            <div className="space-y-6 text-center">
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 p-6 rounded-3xl flex flex-col items-center">
                <CheckCircle2 size={36} className="mb-3 text-emerald-500 animate-bounce" />
                <h3 className="font-black text-emerald-800 text-lg">Check Your Email</h3>
                <p className="text-sm text-emerald-600 mt-2 font-medium">
                  We've sent a password reset link to <strong className="font-bold text-emerald-700">{email}</strong>. Please check your inbox and spam folder.
                </p>
              </div>
              <Link to="/login" className="block w-full">
                <Button variant="secondary" className="w-full py-5 text-lg shadow-xl shadow-secondary/20">
                  Return to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
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
              </div>

              <Button type="submit" variant="secondary" className="w-full py-5 text-lg shadow-xl shadow-secondary/20" disabled={loading}>
                {loading ? 'Sending Request...' : 'Send Reset Link'}
              </Button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;

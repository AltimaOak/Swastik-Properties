import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';

const AuthContext = createContext({
  currentUser: null,
  userData: null,
  loading: true,
  isAgent: false,
  isBuyer: false
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeDb = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (unsubscribeDb) {
        unsubscribeDb();
        unsubscribeDb = null;
      }

      if (user) {
        setCurrentUser(user);
        
        // Listen to Realtime Database for live user profile updates
        const userRef = ref(db, `users/${user.uid}`);
        unsubscribeDb = onValue(userRef, (snapshot) => {
          if (snapshot.exists()) {
            setUserData(snapshot.val());
          } else {
            setUserData({
              uid: user.uid,
              role: 'buyer',
              email: user.email,
              name: user.displayName || ''
            });
          }
          setLoading(false);
        }, (error) => {
          console.warn("Auth User Data Sync: ", error.message);
          setLoading(false);
        });
      } else {
        setCurrentUser(null);
        setUserData(null);
        setLoading(false);
      }
    });

    // Safety timeout: Force load if Firebase is taking too long (e.g. network issues)
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => {
      unsubscribeAuth();
      if (unsubscribeDb) unsubscribeDb();
      clearTimeout(timeout);
    };
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
    isAdmin: userData?.role === 'agent', // Using 'agent' as the admin/seller role
    isAgent: userData?.role === 'agent',
    isBuyer: userData?.role === 'buyer'
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-zinc-100 rounded-full"></div>
            <div className="w-20 h-20 border-4 border-t-secondary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="mt-6 text-secondary font-black uppercase tracking-[0.3em] animate-pulse text-sm">Swastik Properties</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

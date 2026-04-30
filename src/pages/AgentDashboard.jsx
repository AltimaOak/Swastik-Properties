import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '../firebase/config';
import { ref, query, orderByChild, equalTo, get, push, remove, set } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Image as ImageIcon, 
  X, 
  Check, 
  Briefcase, 
  TrendingUp, 
  Layout,
  UploadCloud,
  Loader2
} from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';

const AgentDashboard = () => {
  const { currentUser, userData } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    location: '',
    type: 'Flat',
    description: '',
    size: '',
    contactNumber: ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    if (currentUser) {
      fetchAgentProperties();
    }
  }, [currentUser]);

  const fetchAgentProperties = async () => {
    try {
      const snapshot = await get(ref(db, 'properties'));
      if (snapshot.exists()) {
        const data = snapshot.val();
        const allProperties = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setProperties(allProperties.filter(p => p.agentId === currentUser.uid));
      } else {
        setProperties([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    setSelectedFiles([...e.target.files]);
  };

  const handleAddProperty = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const imageUrls = [];
      // Firebase Storage Upload Logic
      for (const file of selectedFiles) {
        // Create a unique filename
        const uniqueFileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
        const imageRef = storageRef(storage, `property_images/${uniqueFileName}`);
        
        // Upload the file
        await uploadBytes(imageRef, file);
        
        // Get the download URL
        const downloadUrl = await getDownloadURL(imageRef);
        imageUrls.push(downloadUrl);
      }

      const newPropertyRef = push(ref(db, 'properties'));
      await set(newPropertyRef, {
        ...formData,
        price: Number(formData.price),
        images: imageUrls,
        agentId: currentUser.uid,
        createdAt: new Date().toISOString()
      });

      setShowAddModal(false);
      resetForm();
      fetchAgentProperties();
    } catch (err) {
      console.error(err);
      alert("Error adding property: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await remove(ref(db, `properties/${id}`));
        setProperties(properties.filter(p => p.id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setFormData({ title: '', price: '', location: '', type: 'Flat', description: '', size: '', contactNumber: '' });
    setSelectedFiles([]);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#FDFDFD]">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-premium relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 text-secondary/5 -mr-4 -mt-4 group-hover:scale-110 transition-transform">
              <Briefcase size={80} />
            </div>
            <h3 className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-2">Total Listings</h3>
            <p className="text-5xl font-black text-secondary">{loading ? '...' : properties.length}</p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-premium relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 text-primary/10 -mr-4 -mt-4 group-hover:scale-110 transition-transform">
              <TrendingUp size={80} />
            </div>
            <h3 className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-2">Account Type</h3>
            <p className="text-4xl font-black text-secondary italic uppercase tracking-tight">Agent</p>
          </div>

          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-secondary p-8 rounded-[2.5rem] shadow-xl shadow-secondary/20 relative overflow-hidden group text-left sm:col-span-2 lg:col-span-1"
          >
            <div className="absolute top-0 right-0 p-6 text-white/10 -mr-2 -mt-2 group-hover:scale-110 transition-transform">
              <Plus size={80} />
            </div>
            <h3 className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-2">Quick Action</h3>
            <p className="text-4xl font-black text-white italic">Add New Property</p>
          </button>
        </div>

        {/* Listings Section */}
        <div className="bg-white rounded-[3rem] border border-zinc-100 p-6 md:p-10 shadow-premium">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-secondary italic flex items-center">
              <Layout className="mr-4" />
              <span>Property Management</span>
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(n => (
                <div key={n} className="h-48 bg-zinc-50 animate-pulse rounded-3xl border border-zinc-100"></div>
              ))}
            </div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {properties.map(p => (
                <div key={p.id} className="group bg-zinc-50 border border-zinc-100 p-5 rounded-[2rem] hover:bg-white hover:shadow-premium transition-all">
                  <div className="flex space-x-5">
                    <img src={p.images?.[0] || 'https://via.placeholder.com/80'} className="w-24 h-24 rounded-2xl object-cover shadow-md" alt="" />
                    <div className="flex-1 min-w-0">
                      <p className="text-secondary font-black truncate text-lg mb-1">{p.title}</p>
                      <p className="text-zinc-500 text-xs font-bold mb-2 flex items-center">
                        <ImageIcon size={12} className="mr-1" /> {p.images?.length || 0} Photos
                      </p>
                      <p className="text-secondary font-black text-sm italic">₹{p.price.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-[10px] bg-white border border-zinc-200 text-secondary px-4 py-1.5 rounded-full font-black uppercase tracking-widest">
                      {p.type}
                    </span>
                    <div className="flex space-x-2">
                      <button className="p-3 bg-white border border-zinc-100 text-secondary rounded-xl hover:bg-secondary hover:text-white transition-all shadow-sm">
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id)}
                        className="p-3 bg-red-50 border border-red-100 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center bg-zinc-50 rounded-[3rem] border border-dashed border-zinc-200">
              <div className="w-20 h-20 bg-white shadow-premium rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-300">
                <Layout size={40} />
              </div>
              <h3 className="text-2xl font-black text-secondary mb-2">No Active Listings</h3>
              <p className="text-zinc-500 font-medium">Start growing your portfolio today.</p>
              <button 
                onClick={() => setShowAddModal(true)}
                className="mt-8 bg-secondary text-white px-10 py-4 rounded-2xl font-black hover:bg-red-900 transition-all shadow-xl shadow-secondary/20"
              >
                List Your First Property
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Property Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !uploading && setShowAddModal(false)}
              className="absolute inset-0 bg-secondary/20 backdrop-blur-md"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3.5rem] relative z-10 shadow-2xl p-8 md:p-14 border border-zinc-100"
            >
              {!uploading && (
                <button onClick={() => setShowAddModal(false)} className="absolute top-10 right-10 text-zinc-300 hover:text-secondary transition-colors">
                  <X size={40} />
                </button>
              )}

              <h2 className="text-4xl font-black text-secondary mb-10 italic tracking-tighter">Publish New Listing</h2>
              
              <form onSubmit={handleAddProperty} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Input 
                    label="Property Title"
                    placeholder="e.g. Modern 3BHK Apartment"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      label="Price (₹)"
                      type="number"
                      placeholder="8500000"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required
                    />
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Type</label>
                      <select 
                        className="w-full bg-zinc-50 border border-zinc-200 text-secondary px-4 py-3.5 rounded-2xl focus:outline-none focus:border-secondary shadow-sm font-bold"
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                      >
                        <option value="Flat">Flat</option>
                        <option value="Shop">Shop</option>
                        <option value="House">House</option>
                        <option value="Land">Land</option>
                      </select>
                    </div>
                  </div>
                  <Input 
                    label="Location"
                    placeholder="e.g. Kasarvadavali, Thane"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    required
                  />
                  <Input 
                    label="Area Size"
                    placeholder="1500 sqft"
                    value={formData.size}
                    onChange={(e) => setFormData({...formData, size: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Description</label>
                  <textarea 
                    rows="5"
                    className="w-full bg-zinc-50 border border-zinc-200 text-secondary px-5 py-4 rounded-[2rem] focus:outline-none focus:border-secondary transition-all placeholder:text-zinc-300 shadow-sm font-medium"
                    placeholder="Describe the property highlights..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                  ></textarea>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Media Upload</label>
                  <div className="border-4 border-dashed border-zinc-100 rounded-[3rem] p-16 text-center hover:border-primary/50 transition-all group relative cursor-pointer bg-zinc-50/50">
                    <input 
                      type="file" 
                      multiple 
                      onChange={handleFileSelect}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      disabled={uploading}
                    />
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-premium text-zinc-300 group-hover:text-primary transition-colors">
                      <UploadCloud size={40} />
                    </div>
                    <p className="text-secondary font-black text-xl">Click to browse photos</p>
                    <p className="text-zinc-400 text-sm mt-2 font-medium">Select up to 5 images (PNG, JPG)</p>
                    
                    {selectedFiles.length > 0 && (
                      <div className="mt-8 flex flex-wrap gap-3 justify-center">
                        {Array.from(selectedFiles).map((file, i) => (
                          <div key={i} className="bg-primary/20 text-secondary px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center">
                            <Check size={14} className="mr-2" /> {file.name.slice(0, 15)}...
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-6">
                  <Button type="submit" variant="secondary" className="w-full py-6 text-xl shadow-2xl shadow-secondary/20" disabled={uploading}>
                    {uploading ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="animate-spin mr-4" size={24} />
                        Publishing to Swastik...
                      </span>
                    ) : 'Confirm & Publish Listing'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AgentDashboard;

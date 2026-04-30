import React, { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../firebase/config';
import PropertyCard from '../components/PropertyCard';
import Input from '../components/Input';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    minPrice: '',
    maxPrice: '',
    location: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const snapshot = await get(ref(db, 'properties'));
      let results = [];
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        results = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      // Client-side filtering for better UX with Firestore's limitations on multi-field inequality
      if (filters.type) {
        results = results.filter(p => p.type === filters.type);
      }
      if (filters.location) {
        results = results.filter(p => p.location.toLowerCase().includes(filters.location.toLowerCase()));
      }
      if (filters.minPrice) {
        results = results.filter(p => p.price >= Number(filters.minPrice));
      }
      if (filters.maxPrice) {
        results = results.filter(p => p.price <= Number(filters.maxPrice));
      }

      // Fallback if empty for demo
      if (results.length === 0 && !filters.type && !filters.location && !filters.minPrice && !filters.maxPrice) {
        results = [
          { id: '1', title: 'Luxury 3BHK Flat', price: 8500000, location: 'Kasarvadavali, Thane', type: 'Flat', images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800'], createdAt: new Date() },
          { id: '2', title: 'Premium Commercial Shop', price: 4500000, location: 'Ghodbunder Road, Thane', type: 'Shop', images: ['https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&q=80&w=800'], createdAt: new Date() },
          { id: '3', title: 'Spacious 4BHK Villa', price: 15000000, location: 'Hiranandani Estate, Thane', type: 'House', images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800'], createdAt: new Date() },
          { id: '4', title: 'Industrial Land', price: 25000000, location: 'Wagle Estate, Thane', type: 'Land', images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800'], createdAt: new Date() }
        ];
      }

      setProperties(results);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    setFilters({ type: '', minPrice: '', maxPrice: '', location: '' });
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#FDFDFD]">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-secondary mb-4 tracking-tighter">Explore <span className="text-primary italic">Properties</span></h1>
          <p className="text-zinc-500 font-medium">Discover your perfect space from our curated collection of premium listings.</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-12">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
            <input 
              type="text" 
              name="location"
              placeholder="Search by location..." 
              value={filters.location}
              onChange={handleFilterChange}
              className="w-full bg-white border border-zinc-200 rounded-2xl py-4 pl-12 pr-4 text-zinc-900 focus:outline-none focus:border-secondary/50 transition-all shadow-premium placeholder:text-zinc-400"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center space-x-2 px-8 py-4 rounded-2xl font-black transition-all shadow-premium ${showFilters ? 'bg-secondary text-white' : 'bg-white text-secondary border border-zinc-100 hover:bg-zinc-50'}`}
          >
            <SlidersHorizontal size={20} />
            <span>Filters</span>
          </button>
        </div>

        {/* Collapsible Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-12"
            >
              <div className="bg-zinc-50 p-8 rounded-[2rem] border border-zinc-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative shadow-inner">
                <button onClick={resetFilters} className="absolute top-4 right-4 text-zinc-400 hover:text-secondary transition-colors flex items-center space-x-1 text-[10px] uppercase font-black tracking-widest">
                  <X size={14} />
                  <span>Reset</span>
                </button>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/50">Property Type</label>
                  <select 
                    name="type" 
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="w-full bg-white border border-zinc-200 rounded-xl p-3 text-sm text-zinc-900 focus:outline-none focus:border-secondary shadow-sm"
                  >
                    <option value="">All Types</option>
                    <option value="Flat">Flat</option>
                    <option value="Shop">Shop</option>
                    <option value="House">House</option>
                    <option value="Land">Land</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/50">Min Price</label>
                  <Input 
                    type="number" 
                    name="minPrice" 
                    placeholder="e.g. 500,000" 
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/50">Max Price</label>
                  <Input 
                    type="number" 
                    name="maxPrice" 
                    placeholder="e.g. 10,000,000" 
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                  />
                </div>

                <div className="flex items-end">
                  <button 
                    onClick={() => setShowFilters(false)}
                    className="w-full bg-secondary text-white py-3.5 rounded-xl font-bold text-sm hover:bg-red-900 transition-colors shadow-lg shadow-secondary/20"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
              <div key={n} className="space-y-4">
                <div className="aspect-[4/5] bg-zinc-100 animate-pulse rounded-[2.5rem]"></div>
                <div className="h-6 w-3/4 bg-zinc-100 animate-pulse rounded-full"></div>
                <div className="h-4 w-1/2 bg-zinc-100 animate-pulse rounded-full"></div>
              </div>
            ))}
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {properties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-zinc-50 rounded-[3rem] border border-zinc-100 px-6">
            <div className="w-20 h-20 bg-white shadow-premium rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-300">
              <Search size={40} />
            </div>
            <h3 className="text-2xl font-black text-secondary mb-2">No Matches Found</h3>
            <p className="text-zinc-500 font-medium">Try adjusting your filters or search query.</p>
            <button onClick={resetFilters} className="mt-8 text-secondary font-black underline hover:text-red-900 transition-colors uppercase tracking-widest text-[10px]">Clear all filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties;

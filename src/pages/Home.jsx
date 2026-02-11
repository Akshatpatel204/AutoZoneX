import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Car_card from '../component/Car_card';
import Footer from '../component/Footer';

const Home = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const API_BASE = import.meta.env.VITE_backendapi;

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get(`${API_BASE}/fetch_all_car`);
        setCars(response.data["data :- "] || []);
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, [API_BASE]);

  /**
   * OPTIMIZATION 1: useMemo
   * The filtering logic only re-runs when 'cars' or 'searchQuery' changes.
   * This prevents expensive array operations on every unrelated re-render.
   */
  const filteredCars = useMemo(() => {
    const searchTerm = searchQuery.toLowerCase().trim();
    if (!searchTerm) return cars;

    return cars.filter((car) => 
      car.brand?.toLowerCase().includes(searchTerm) ||
      car.Name?.toLowerCase().includes(searchTerm)
    );
  }, [cars, searchQuery]);

  /**
   * OPTIMIZATION 2: useCallback
   * Memoizes the navigation function to prevent child components from 
   * thinking the prop has changed.
   */
  const handleCardClick = useCallback((id) => {
    navigate(`/detail/${id}`);
  }, [navigate]);

  return (
    <div className='bg-black text-white transition-colors duration-300 font-sans'>
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/50 z-10" />
          <img
            className="w-full h-full object-cover"
            alt="Hero Background"
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2070"
            loading="lazy" // OPTIMIZATION: Browser-level lazy loading for images
          />
        </div>
        <div className="relative z-30 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black mb-8">
            FIND YOUR NEXT <span className="text-[#0da6f2] italic">OBSESSION</span>
          </h1>
          <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl max-w-2xl mx-auto flex items-center gap-2 border border-white/10">
            <input
              className="bg-transparent border-none focus:ring-0 text-white w-full py-4 px-6 text-lg placeholder:text-gray-400"
              placeholder="Search Ferrari, Porsche, Lamborghini..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="bg-[#0da6f2] hover:bg-blue-600 px-8 py-4 rounded-xl text-white font-bold transition-all">
              SEARCH
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 -mt-10 relative z-40 pb-24">
        <section className="mb-5">
          <div className="flex items-center justify-between mb-8 px-4">
            <h2 className="text-3xl font-black uppercase italic">
              {searchQuery ? "Search Results" : "Trending"} <span className="text-[#0da6f2]">Reviews</span>
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0da6f2]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
                <div 
                  key={car._id} 
                  className="cursor-pointer" 
                  onClick={() => handleCardClick(car._id)}
                >
                  <Car_card car={car} />
                </div>
              ))}
            </div>
          )}

          {!loading && filteredCars.length === 0 && (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/20">
              <p className="text-2xl font-bold text-gray-400">No cars found matching "{searchQuery}"</p>
              <button 
                onClick={() => setSearchQuery("")}
                className="mt-4 text-[#0da6f2] hover:underline"
              >
                Clear Search
              </button>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Filter, X } from 'lucide-react';
import Car_card from '../component/Car_card';
import Footer from '../component/Footer';

const Home = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [dbBrands, setDbBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All Brands");
  
  // ✅ Use a ref to ensure we only pick ONE car per session
  const randomCarPicked = useRef(false);
  const [heroImage, setHeroImage] = useState("https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2070");

  const API_BASE = import.meta.env.VITE_backendapi;

  const formatBrandName = (str) => {
    if (!str) return "";
    let fixedStr = str.toLowerCase() === "rolls royals" || str.toLowerCase() === "rolls-royce" 
      ? "rolls royce" 
      : str;
    
    return fixedStr
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // 1. Fetch Brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await axios.get(`${API_BASE}/get_brands`);
        setDbBrands(res.data.map(b => b.name));
      } catch (err) {
        console.error("Error fetching brands:", err);
      }
    };
    fetchBrands();
  }, [API_BASE]);

  // 2. Fetch Cars & Set Random Hero Image (Fixed to run logic once)
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get(`${API_BASE}/fetch_all_car`);
        const carData = response.data["data :- "] || [];
        setCars(carData);

        // ✅ Check ref so this only sets the image once per refresh
        if (carData.length > 0 && !randomCarPicked.current) {
          const randomCar = carData[Math.floor(Math.random() * carData.length)];
          if (randomCar.images && randomCar.images.length > 0) {
            setHeroImage(randomCar.images[0]);
            randomCarPicked.current = true; // Block further changes until next refresh
          }
        }
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, [API_BASE]);

  const brandsList = useMemo(() => {
    const formatted = dbBrands.map(b => formatBrandName(b));
    const sorted = formatted.sort((a, b) => a.localeCompare(b));
    return ["All Brands", ...sorted];
  }, [dbBrands]);

  const filteredCars = useMemo(() => {
    let result = cars;
    const searchTerm = searchQuery.toLowerCase().trim();

    if (selectedBrand !== "All Brands") {
      result = result.filter(car => formatBrandName(car.brand) === selectedBrand);
    }

    if (searchTerm) {
      result = result.filter((car) => 
        car.brand?.toLowerCase().includes(searchTerm) ||
        car.Name?.toLowerCase().includes(searchTerm)
      );
    }
    return result;
  }, [cars, searchQuery, selectedBrand]);

  const handleCardClick = useCallback((id) => {
    navigate(`/detail/${id}`);
  }, [navigate]);

  return (
    <div className='bg-black text-white transition-colors duration-300 font-sans'>
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <img
            className="w-full h-full object-cover transition-opacity duration-700"
            alt="Hero Background"
            src={heroImage}
            loading="eager"
          />
        </div>
        
        <div className="relative z-30 text-center px-4 w-full max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black mb-8 drop-shadow-2xl">
            FIND YOUR NEXT <span className="text-[#0da6f2] italic">OBSESSION</span>
          </h1>

          <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl max-w-3xl mx-auto flex items-center gap-2 border border-white/10 shadow-2xl">
            <div className="relative flex items-center justify-center h-14 w-14 min-w-[56px]">
              <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-colors ${selectedBrand !== "All Brands" ? "text-[#0da6f2]" : "text-gray-400"}`}>
                <Filter size={22} strokeWidth={selectedBrand !== "All Brands" ? 3 : 2} />
              </div>
              <select 
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                title="Filter by Brand"
              >
                {brandsList.map(brand => (
                  <option key={brand} value={brand} className="bg-[#1a1a1a] text-white py-2">{brand}</option>
                ))}
              </select>
            </div>

            <div className="w-[1px] h-8 bg-white/20 hidden md:block"></div>

            <input
              className="bg-transparent border-none focus:ring-0 text-white w-full py-4 px-2 text-lg placeholder:text-gray-400"
              placeholder="Search model or name..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <button className="hidden md:block bg-[#0da6f2] hover:bg-blue-600 px-8 py-4 rounded-xl text-white font-bold transition-all active:scale-95">
              SEARCH
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 -mt-10 relative z-40 pb-24">
        <section className="mb-5">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 px-4 gap-4">
            <h2 className="text-3xl font-black uppercase italic">
              {searchQuery || selectedBrand !== "All Brands" ? (
                <>Filtered <span className="text-[#0da6f2]">Results</span></>
              ) : (
                <>Trending <span className="text-[#0da6f2]">Reviews</span></>
              )}
            </h2>
            
            {(searchQuery || selectedBrand !== "All Brands") && (
               <button 
                onClick={() => { setSearchQuery(""); setSelectedBrand("All Brands"); }}
                className="text-xs bg-[#0da6f2]/10 hover:bg-[#0da6f2]/20 text-[#0da6f2] border border-[#0da6f2]/30 px-4 py-2 rounded-full flex items-center gap-2 transition-all font-bold"
               >
                 {selectedBrand !== "All Brands" && <span className="uppercase">{selectedBrand}</span>}
                 {searchQuery && <span>"{searchQuery}"</span>}
                 <X size={14} />
               </button>
            )}
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
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;

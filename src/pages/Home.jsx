import React from 'react'
import { useNavigate } from "react-router-dom";
import Car_card from '../component/Car_card';
import Footer from '../component/Footer';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className='bg-black text-white transition-colors duration-300 font-sans ' >
      {/* Hero Section */}
      <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="absolute inset-0 hero-gradient z-20" />
          <img
            className="w-full h-full object-cover scale-105"
            data-alt="Modern dark supercar in a futuristic garage"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCg-e_1wsAbpGbL7XlkBAWDJwHh8ihp8mEEsa1LLLwpcDeHLI3NpQ0ZINIRG1ht15OmuAz1d2XF0zr8IUS787GrpZiWem2tcAcih06zq9XkC-gvxvZerCcWOO2LZl9x3droSHEXZOkbEGdVDugjzXMTbX03Wr0VwA0H6AIMLS-tcnvLaRGsWXJ7QKkkvfo_m7_EFRv4wHe5vlBAOJwPVjqgtvSCpIy0ZXnkEme7Xn2bLP3DAtNybeWir4RCc5CXI3iIXbaC6Sn45s_i"
          />
        </div>
        <div className="relative z-30 text-center px-4 max-w-4xl mx-auto">
          <span className="inline-block py-1 px-4 rounded-full bg-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-6 border border-primary/30">
            Premium Automotive Intelligence
          </span>
          <h1 className="text-6xl md:text-8xl font-black leading-tight tracking-tight mb-8">
            FIND YOUR NEXT <span className="text-primary italic">OBSESSION</span>
          </h1>
          <div className="glass p-2 rounded-2xl max-w-2xl mx-auto flex items-center gap-2">
            <div className="flex-1 flex items-center px-6 gap-3">
              <span className="material-symbols-outlined text-gray-400 hidden lg:inline">
                search
              </span>
              <input
                className="bg-transparent border-none focus:ring-0 text-white w-full py-4 text-lg placeholder:text-gray-500 font-medium"
                placeholder="Search Ferrari, Porsche, Lamborghini..."
                type="text"
              />
            </div>
            <button className="bg-primary hover:bg-blue-600 px-4 py-4 rounded-xl text-white font-bold transition-all flex items-center gap-2">
              SEARCH
            </button>
          </div>
        </div>
      </section>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 -mt-20 relative z-40 pb-24">
        {/* Trending Reviews Grid */}
        <section className="mb-5 mt-3">
          <div className="flex items-center justify-between mb-8 px-4">
            <h2 className="text-3xl font-black tracking-tighter uppercase italic">
              Trending <span className="text-primary">Reviews</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-3 mt-3">
            <div onClick={()=>navigate('/detail')}>
              <Car_card />
            </div>
            <div onClick={()=>navigate('/detail')}>
              <Car_card />
            </div>
            <div onClick={()=>navigate('/detail')}>
              <Car_card />
            </div>
            <div onClick={()=>navigate('/detail')}>
              <Car_card />
            </div>
            <div onClick={()=>navigate('/detail')}>
              <Car_card />
            </div>
          </div>
        </section>
        {/* Recent Inspections Slider Area */}

      </main>
      <Footer />
    </div>
  )
}


export default Home

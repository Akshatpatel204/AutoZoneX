import React from 'react'

const Car_card = () => {
  return (
    <div className="group bg-card-dark rounded-2xl overflow-hidden border border-white/5 hover:border-primary/40 transition-all h-90">
      <div className="h-64 relative overflow-hidden">
        <img
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          data-alt="Black luxury sports car in forest road"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAr7nvm66DuzSWevHLUv30GccIG7tuKqOwpnfpKQlykgS2YFW91lLHRtbb0nNyADco67_dkppznZQFauwDyWrt8ZnBY1YY3_OcrN7-yc7oqMZGJYAfUtIav5IyFZmuVm6L3-oHdm6s8MEE0QySvrmBNSUHkY0dWssBvusijorYX_HjUb7boLmo-VXbbna4oF-Rmd3h78sYnqEZFjxbz5AFJRwxdMXVKG9040KOnr_aGGu3E7Oirsm8lmeDopb6zvfQGYZy17g5pb2A5"
        />
      </div>
      <div className="p-3">
        {/* <div className="flex items-center gap-2 mb-3"> */}
        {/* <div className="flex text-primary">
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">
                  star_half
                </span>
              </div> */}
        {/* <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                9.4 Rating
              </span> */}
        {/* </div> */}
        <h3 className="text-xl font-bold  group-hover:text-primary transition-colors p-0">
          2024 Aston Martin Valour: The Last Pure Manual
        </h3>
        {/* <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
              A masterclass in analog driving dynamics combined with modern
              British engineering excellence.
            </p> */}
        {/* <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-800" />
                <span className="text-xs font-bold text-gray-300">
                  Marcus Sterling
                </span>
              </div>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                2h ago
              </span>
            </div> */}
      </div>
    </div>
  )
}

export default Car_card

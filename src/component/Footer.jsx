import React from 'react'

const Footer = () => {
  return (
    <div>
            {/* Footer */}
      <footer className="bg-card-dark border-t border-white/5 py-12  p-3">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary text-2xl">
                  deployed_code
                </span>
                <h2 className="text-xl font-black tracking-tighter uppercase italic text-white">
                  AutoZone<span className="text-primary">X</span>
                </h2>
              </div>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">
                The ultimate destination for automotive enthusiasts seeking
                data-driven reviews and elite inspection services.
              </p>
            </div>
            <div>
              <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-6">
                Platform
              </h4>
              <ul className="space-y-4">
                <li>
                  <a
                    className="text-gray-500 hover:text-primary text-sm font-bold transition-colors"
                    href="#"
                  >
                    Compare Tool
                  </a>
                </li>
                <li>
                  <a
                    className="text-gray-500 hover:text-primary text-sm font-bold transition-colors"
                    href="#"
                  >
                    Car Reviews
                  </a>
                </li>
                <li>
                  <a
                    className="text-gray-500 hover:text-primary text-sm font-bold transition-colors"
                    href="#"
                  >
                    Performance Lab
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-6">
                Services
              </h4>
              <ul className="space-y-4">
                <li>
                  <a
                    className="text-gray-500 hover:text-primary text-sm font-bold transition-colors"
                    href="#"
                  >
                    Vehicle Inspection
                  </a>
                </li>
                <li>
                  <a
                    className="text-gray-500 hover:text-primary text-sm font-bold transition-colors"
                    href="#"
                  >
                    History Reports
                  </a>
                </li>
                <li>
                  <a
                    className="text-gray-500 hover:text-primary text-sm font-bold transition-colors"
                    href="#"
                  >
                    VIP Membership
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-6">
                Join The Club
              </h4>
              <div className="flex gap-2">
                <input
                  className="bg-white/5 border-white/10 rounded-lg text-sm w-full focus:ring-primary focus:border-primary"
                  placeholder="Email"
                  type="email"
                />
                <button className="bg-primary px-4 py-2 rounded-lg text-xs font-black uppercase">
                  Join
                </button>
              </div>
              <div className="flex gap-4 mt-3">
                <a
                  className="text-gray-500 hover:text-white transition-colors"
                  href="#"
                >
                  <span className="material-symbols-outlined text-xl">share</span>
                </a>
                <a
                  className="text-gray-500 hover:text-white transition-colors"
                  href="#"
                >
                  <span className="material-symbols-outlined text-xl">public</span>
                </a>
                <a
                  className="text-gray-500 hover:text-white transition-colors"
                  href="#"
                >
                  <span className="material-symbols-outlined text-xl">camera</span>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
              © 2024 AUTOZONEX MEDIA GROUP. ALL RIGHTS RESERVED.
            </p>
            <div className="flex gap-8">
              <a
                className="text-[10px] font-black text-gray-600 uppercase tracking-widest hover:text-primary"
                href="#"
              >
                Privacy Policy
              </a>
              <a
                className="text-[10px] font-black text-gray-600 uppercase tracking-widest hover:text-primary"
                href="#"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer

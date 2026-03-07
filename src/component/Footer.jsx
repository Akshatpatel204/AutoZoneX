import React from 'react';

const Footer = () => {
  const handleShare = async (e) => {
    e.preventDefault();
    const shareData = {
      title: 'AutoZoneX',
      text: 'Check out this amazing vehicle on AutoZoneX!',
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <footer className="bg-black border-t border-white/5 py-12 p-3 h-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Logo Section */}
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-[#0da6f2] text-2xl">deployed_code</span>
              <h2 className="text-xl font-black tracking-tighter uppercase italic text-white">
                AutoZone<span className="text-[#0da6f2]">X</span>
              </h2>
            </div>
            <p className="text-gray-500 text-sm font-medium leading-relaxed">
              The ultimate destination for automotive enthusiasts seeking data-driven reviews.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-6">Platform</h4>
            <ul className="space-y-4">
              <li><a className="text-gray-500 hover:text-[#0da6f2] text-sm font-bold transition-colors" href="#">Car Reviews</a></li>
              <li><a className="text-gray-500 hover:text-[#0da6f2] text-sm font-bold transition-colors" href="#">Performance Lab</a></li>
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-6">Services</h4>
            <ul className="space-y-4">
              <li><a className="text-gray-500 hover:text-[#0da6f2] text-sm font-bold transition-colors" href="#">Vehicle Inspection</a></li>
              <li><a className="text-gray-500 hover:text-[#0da6f2] text-sm font-bold transition-colors" href="#">VIP Membership</a></li>
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-6">Join The Club</h4>
            <div className="flex gap-2 mb-4">
              <input className="bg-white/5 border border-white/10 rounded-lg text-sm w-full px-3 text-white focus:outline-none focus:border-[#0da6f2]" placeholder="Email" type="email" />
              <button className="bg-[#0da6f2] px-4 py-2 rounded-lg text-xs font-black uppercase text-white">Join</button>
            </div>
            
            <div className="flex gap-4">
              <button onClick={handleShare} className="text-gray-500 hover:text-white transition-colors flex items-center gap-1 group">
                <span className="material-symbols-outlined text-xl group-hover:text-[#0da6f2]">share</span>
              </button>
              
              <a className="text-gray-500 hover:text-white transition-colors" href="#"><span className="material-symbols-outlined text-xl">public</span></a>

              {/* ✅ FIXED INSTAGRAM ICON REDIRECT */}
              <a 
                href="https://www.instagram.com/autozonex.1?utm_source=qr&igsh=MTR1NzFleDl4YWluMw==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-[#E4405F] transition-all duration-300 flex items-center"
              >
                {/* Use 'camera' or 'nest_cam_wired_stand' as common Material Symbols if 'instagram' is missing */}
                <span className="material-symbols-outlined text-xl">camera</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest text-center md:text-left">
            © 2024 AUTOZONEX MEDIA GROUP. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

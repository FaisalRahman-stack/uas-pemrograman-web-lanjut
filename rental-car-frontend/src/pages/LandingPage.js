import React from 'react';
import { Link } from 'react-router-dom';
import Image2 from '../assets/UI-assets/LandingImage2.png';
import Image3 from '../assets/UI-assets/LandingImage3.png';
import Image4 from '../assets/UI-assets/LandingImage4.png';

const LandingPage = () => {
  return (
    <div className="bg-white text-gray-900 font-sans flex flex-col min-h-screen">
      <nav className="flex justify-between items-center py-6 px-12 bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="font-bold text-xl tracking-tighter uppercase">Rentix Privé</div>
        <div className="flex gap-8 text-xs uppercase tracking-widest text-gray-600 items-center">
          <Link to="/dashboard" className="hover:text-black transition-colors font-medium">Katalog</Link>
          <Link to="#" className="hover:text-black transition-colors font-medium">Layanan</Link>
          <div className="flex gap-2 font-medium">
            <Link to="/login" className="hover:text-black transition-colors">Login</Link>
            <span>|</span>
            <Link to="/register" className="hover:text-black transition-colors">Register</Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        <section className="py-24 px-12 space-y-24">
          <div className="flex items-center justify-between">
            <div className="w-1/2 pr-16">
              <h2 className="text-3xl font-bold uppercase mb-4">DIRANCANG UNTUK MENGUASAI JALANAN</h2>
              <p className="text-gray-600 leading-relaxed">
                Armada pilihan Rentix Privé dan sistem reservasi yang terintegrasi memastikan pengalaman mobilitas premium Anda berjalan sempurna.
              </p>
            </div>
            <img src={Image2} alt="Feature 1" className="w-1/2 h-80 object-cover shadow-sm" />
          </div>

          <div className="flex items-center justify-between flex-row-reverse">
            <div className="w-1/2 pl-16">
              <h2 className="text-3xl font-bold uppercase mb-4">LEBIH DARI SEKADAR PERJALANAN</h2>
              <p className="text-gray-600 leading-relaxed">
                Didukung oleh arsitektur digital mutakhir, platform kami menjamin akurasi real-time dan pemesanan instan.
              </p>
            </div>
            <img src={Image3} alt="Feature 2" className="w-1/2 h-80 object-cover shadow-sm" />
          </div>

          <div className="flex items-center justify-between">
            <div className="w-1/2 pr-16">
              <h2 className="text-3xl font-bold uppercase mb-4">PERJALANAN YANG MENCURI PERHATIAN</h2>
              <p className="text-gray-600 leading-relaxed">
                Performa tanpa kompromi berpadu dengan keanggunan tak tertandingi untuk Anda yang menginginkan yang terbaik.
              </p>
            </div>
            <img src={Image4} alt="Feature 3" className="w-1/2 h-80 object-cover shadow-sm" />
          </div>
        </section>

        <section className="py-20 text-center border-t border-gray-100">
          <h3 className="text-lg uppercase tracking-widest mb-4 font-semibold">Dapatkan Info Terkini Rentix Privé</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto text-sm">
            Koleksi armada terbaru, layanan terpersonalisasi, inspirasi perjalanan premium, dan kabar terkini di Rentix Privé.
          </p>
          <div className="max-w-xs mx-auto border-b border-gray-300 pb-2">
              <input 
                type="email" 
                placeholder="Masukkan alamat email Anda" 
                className="w-full text-center outline-none text-sm placeholder-gray-400" 
              />
          </div>
        </section>
      </main>

      <footer className="bg-black text-white py-16 px-12 grid grid-cols-4 gap-8">
        <div>
          <h4 className="font-bold mb-4 uppercase text-xs tracking-widest">Rentix Privé</h4>
          <p className="text-gray-400 text-[10px] leading-relaxed">
            Koleksi armada terbaru, layanan terpersonalisasi, dan kabar terkini di Rentix Privé.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-4 uppercase text-xs tracking-widest">Perusahaan</h4>
          <ul className="text-gray-400 text-[10px] space-y-2">
            <li className="hover:text-white cursor-pointer">Tentang Kami</li>
            <li className="hover:text-white cursor-pointer">Keberlanjutan</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4 uppercase text-xs tracking-widest">Bantuan</h4>
          <ul className="text-gray-400 text-[10px] space-y-2">
            <li className="hover:text-white cursor-pointer">Hubungi Kami</li>
            <li className="hover:text-white cursor-pointer">FAQ</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4 uppercase text-xs tracking-widest">Legalitas</h4>
          <ul className="text-gray-400 text-[10px] space-y-2">
            <li className="hover:text-white cursor-pointer">Syarat & Ketentuan</li>
            <li className="hover:text-white cursor-pointer">Kebijakan Privasi</li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
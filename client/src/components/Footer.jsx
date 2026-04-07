import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="container mx-auto px-4 2xl:px-20 py-16">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 items-start">

          {/* Left / Brand */}
          <div className="md:col-span-2 pr-0 md:pr-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white p-2 rounded-xl">
                 <img src={assets.iet_logo_2} className="h-10 object-contain" alt="IET Lucknow" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">IET Lucknow</h2>
                <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mt-0.5">Placement Portal</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Empowering students to achieve their career goals. Connecting premium talent with world-class organizations.
            </p>
          </div>

          {/* Middle / Team */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Placement Cell</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="hover:text-white transition-colors cursor-pointer flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Dr. Arun Kumar Tiwari
              </li>
              <li className="hover:text-white transition-colors cursor-pointer flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Dr. Pragati Shukla
              </li>
              <li className="hover:text-white transition-colors cursor-pointer flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Dr. Pushkar Tripathi
              </li>
            </ul>
          </div>

          {/* Right / Contact */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Get in Touch</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <span>placement@ietlucknow.ac.in</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                <span>+91 98765*****</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Institute of Engineering and Technology, Lucknow. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all">
              <img src={assets.facebook_icon} className="h-4 filter brightness-0 invert" alt="Facebook" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white transition-all">
              <img src={assets.instagram_icon} className="h-4 filter brightness-0 invert" alt="Instagram" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-400 hover:text-white transition-all">
              <img src={assets.twitter_icon} className="h-4 filter brightness-0 invert" alt="Twitter" />
            </a>
          </div>

        </div>

      </div>
    </footer>
  )
}

export default Footer
import { useContext, useRef } from 'react'
import { motion } from 'framer-motion'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { Search, MapPin } from 'lucide-react'

const Hero = () => {

  const { setSearchFilter, setIsSearched } = useContext(AppContext)

  const titleRef = useRef(null)
  const locationRef = useRef(null)

  const onSearch = () => {
    setSearchFilter({
      title: titleRef.current.value,
      location: locationRef.current.value
    })
    setIsSearched(true)
  }

  return (
    <div className="px-4 2xl:px-20 mt-6 mb-12">
      
      {/* Hero Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative h-[70vh] rounded-3xl overflow-hidden shadow-2xl"
      >

        {/* Background Image with Parallax subtle scaling */}
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          src={assets.IET_Lucknow}
          alt="IET Lucknow"
          className="absolute w-full h-full object-cover"
        />

        {/* Premium Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-gray-900/90 via-gray-900/60 to-transparent"></div>

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center h-full text-center px-4">
          <div className="max-w-4xl text-white">

            {/* Heading */}
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-md"
            >
              Welcome to <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">IET Lucknow Placement Portal</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-6 text-base sm:text-lg lg:text-xl text-gray-200 font-light max-w-2xl mx-auto drop-shadow-sm"
            >
              Discover elite on-campus opportunities, connect with world-class recruiters,
              and take the first bold step towards your future.
            </motion.p>

            {/* Glass Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-10 flex flex-col sm:flex-row items-center glass-panel p-2 rounded-2xl mx-auto shadow-2xl max-w-2xl"
            >
              
              {/* Job Input */}
              <div className="flex items-center w-full px-4 py-2">
                <Search size={20} className="text-gray-500 mr-3 hidden sm:block" />
                <input
                  type="text"
                  placeholder="What role are you looking for?"
                  className="w-full bg-transparent text-gray-800 placeholder-gray-500 outline-none font-medium"
                  ref={titleRef}
                />
              </div>

              {/* Divider */}
              <div className="h-10 w-px bg-gray-300 hidden sm:block"></div>

              {/* Location Input */}
              <div className="flex items-center w-full px-4 py-2 border-t sm:border-t-0 border-gray-200">
                <MapPin size={20} className="text-gray-500 mr-3 hidden sm:block" />
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full bg-transparent text-gray-800 placeholder-gray-500 outline-none font-medium"
                  ref={locationRef}
                />
              </div>

              {/* Search Button */}
              <button
                onClick={onSearch}
                className="btn-primary w-full sm:w-auto mt-2 sm:mt-0 font-bold tracking-wide"
              >
                Search Jobs
              </button>

            </motion.div>

          </div>
        </div>

      </motion.div>

      {/* Top Recruiters Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className='glass-panel shadow-sm mx-auto mt-10 p-6 rounded-2xl max-w-5xl'
      >
        <div className='flex flex-col md:flex-row items-center justify-between gap-6'>
            <p className='font-semibold text-gray-600 uppercase tracking-wider text-sm'>Our Top Recruiters</p>
            <div className='flex items-center justify-center gap-8 md:gap-12 flex-wrap opacity-70 grayscale hover:grayscale-0 transition-all duration-500'>
                <img className='h-6 object-contain hover:scale-110 transition-transform' src={assets.microsoft_logo} alt="Microsoft" />
                <img className='h-6 object-contain hover:scale-110 transition-transform' src={assets.walmart_logo} alt="Walmart" />
                <img className='h-6 object-contain hover:scale-110 transition-transform' src={assets.accenture_logo} alt="Accenture" />
                <img className='h-6 object-contain hover:scale-110 transition-transform' src={assets.samsung_logo} alt="Samsung" />
                <img className='h-6 object-contain hover:scale-110 transition-transform' src={assets.amazon_logo} alt="Amazon" />
                <img className='h-6 object-contain hover:scale-110 transition-transform' src={assets.adobe_logo} alt="Adobe" />
            </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Hero
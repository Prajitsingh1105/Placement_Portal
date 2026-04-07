import { useContext, useState, useEffect } from 'react'
import { assets, JobCategories, JobLocations } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import JobCard from './JobCard'
import { motion } from 'framer-motion'
import { Filter, X } from 'lucide-react'

const JobListing = () => {
    const { isSearched, searchFilter, setSearchFilter, jobs } = useContext(AppContext)
    const [showFilter, setShowFilter] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedCategories, setSelectedCategories] = useState([])
    const [selectedLocations, setSelectedLocations] = useState([])
    const [filteredJobs, setFilteredJobs] = useState(jobs)

    const handleCategoryChange = (category) => {
        setSelectedCategories(
            prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        )
    }

    const handleLocationChange = (location) => {
        setSelectedLocations(
            prev => prev.includes(location) ? prev.filter(c => c !== location) : [...prev, location]
        )
    }

    useEffect(() => {
        const matchesCategory = job => selectedCategories.length === 0 || selectedCategories.includes(job.category)
        const matchesLocation = job => selectedLocations.length === 0 || selectedLocations.includes(job.location)
        const matchesTitle = job => searchFilter.title === "" || job.title.toLowerCase().includes(searchFilter.title.toLowerCase())
        const matchesSearchLocation = job => searchFilter.location === "" || job.location.toLowerCase().includes(searchFilter.location.toLowerCase())

        const newFilteredJobs = jobs.slice().reverse().filter(
            job => matchesCategory(job) && matchesLocation(job) && matchesTitle(job) && matchesSearchLocation(job)
        )

        setFilteredJobs(newFilteredJobs)
        setCurrentPage(1)
    }, [jobs, selectedCategories, selectedLocations, searchFilter])

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    }

    return (
        <div className='container 2xl:px-20 mx-auto flex flex-col lg:flex-row gap-8 py-8 px-4'>
            {/* Sidebar */}
            <div className='w-full lg:w-1/4'>
                
                {/* Hero-style visual banner for sidebar */}
                <div className="glass-panel p-6 rounded-2xl mb-6 bg-gradient-to-br from-indigo-500 to-blue-600 text-white relative overflow-hidden shadow-lg hidden lg:block">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mt-10 -mr-10"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl -mb-8 -ml-8"></div>
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-2 tracking-tight">Your Next Big Tech Role</h3>
                        <p className="text-blue-100 text-sm mb-4 leading-relaxed">
                            Filter through premium positions curated for IET students.
                        </p>
                        <div className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors cursor-pointer px-4 py-2 rounded-full text-xs font-semibold backdrop-blur-sm shadow-sm ring-1 ring-white/30">
                            Explore Companies &rarr;
                        </div>
                    </div>
                </div>

                {/* Current Search Tags */}
                {isSearched && (searchFilter.title !== "" || searchFilter.location !== "") && (
                    <div className="mb-8">
                        <h3 className='font-medium text-lg mb-3 text-gray-800'>Current Search</h3>
                        <div className='flex flex-wrap gap-2'>
                            {searchFilter.title && (
                                <span className='inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-full text-sm font-medium'>
                                    {searchFilter.title}
                                    <X size={14} onClick={() => setSearchFilter(prev => ({ ...prev, title: "" }))} className="cursor-pointer hover:text-blue-900" />
                                </span>
                            )}
                            {searchFilter.location && (
                                <span className='inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-full text-sm font-medium'>
                                    {searchFilter.location}
                                    <X size={14} onClick={() => setSearchFilter(prev => ({ ...prev, location: "" }))} className="cursor-pointer hover:text-indigo-900" />
                                </span>
                            )}
                        </div>
                    </div>
                )}

                <button 
                  onClick={() => setShowFilter(prev => !prev)} 
                  className='flex items-center gap-2 px-6 py-2 w-full justify-center rounded-lg border border-gray-300 shadow-sm text-gray-700 font-medium lg:hidden mb-6'
                >
                    <Filter size={18} /> {showFilter ? "Close Filters" : "Show Filters"}
                </button>

                <div className={`glass-panel p-6 rounded-2xl ${showFilter ? 'block' : 'hidden lg:block'}`}>
                    {/* Category Filter */}
                    <div>
                        <h4 className='font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100'>Categories</h4>
                        <ul className='space-y-3'>
                            {JobCategories.map((category, index) => (
                                <li className='flex items-center' key={index}>
                                    <input
                                        id={`cat-${index}`}
                                        className='w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300'
                                        type="checkbox"
                                        onChange={() => handleCategoryChange(category)}
                                        checked={selectedCategories.includes(category)}
                                    />
                                    <label htmlFor={`cat-${index}`} className="ml-3 text-sm text-gray-600 block pl-1 cursor-pointer">
                                        {category}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Location Filter */}
                    <div className="mt-8">
                        <h4 className='font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100'>Locations</h4>
                        <ul className='space-y-3'>
                            {JobLocations.map((location, index) => (
                                <li className='flex items-center' key={index}>
                                    <input
                                        id={`loc-${index}`}
                                        className='w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300'
                                        type="checkbox"
                                        onChange={() => handleLocationChange(location)}
                                        checked={selectedLocations.includes(location)}
                                    />
                                    <label htmlFor={`loc-${index}`} className="ml-3 text-sm text-gray-600 block pl-1 cursor-pointer">
                                        {location}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Job listings */}
            <section className='w-full lg:w-3/4'>
                <div className="mb-8">
                    <h3 className='font-extrabold text-3xl text-gray-900 tracking-tight' id='job-list'>Latest Jobs</h3>
                    <p className='text-gray-500 mt-1'>Explore premium roles tailored for you</p>
                </div>

                <motion.div 
                   variants={container}
                   initial="hidden"
                   animate="show"
                   className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                >
                    {filteredJobs.slice((currentPage - 1) * 6, currentPage * 6).map((job, index) => (
                        <JobCard key={index} job={job} />
                    ))}
                </motion.div>

                {/* Pagination */}
                {filteredJobs.length > 0 && (
                    <div className='flex items-center justify-center space-x-2 mt-12'>
                        <button 
                            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))} 
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <img src={assets.left_arrow_icon} alt="Previous" className="w-5" />
                        </button>
                        
                        {Array.from({ length: Math.ceil(filteredJobs.length / 6) }).map((_, index) => (
                            <button 
                                key={index}
                                onClick={() => setCurrentPage(index + 1)} 
                                className={`w-10 h-10 rounded-full font-medium transition-all ${currentPage === index + 1 ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                {index + 1}
                            </button>
                        ))}

                        <button 
                            onClick={() => setCurrentPage(Math.min(currentPage + 1, Math.ceil(filteredJobs.length / 6)))}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <img src={assets.right_arrow_icon} alt="Next" className="w-5" />
                        </button>
                    </div>
                )}
            </section>
        </div>
    )
}

export default JobListing

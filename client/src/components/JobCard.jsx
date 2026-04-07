import React from 'react'
import {assets} from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Briefcase } from 'lucide-react'

const JobCard = ({ job }) => {

  const navigate = useNavigate()

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className='bg-white p-5 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.05)] rounded-xl border border-gray-100 hover-lift relative overflow-hidden group'
    >
      <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300'></div>
      
      <div className='flex flex-col items-center text-center'>
        <div className='p-2 bg-gray-50 rounded-lg mb-3'>
          <img className='h-8 w-8 object-contain' src={job.logo || assets.company_icon} alt="" />
        </div>
        <p className='font-semibold text-gray-800 text-sm'>{job.company || "General Company"}</p>
      </div>
      
      <h4 className='font-bold text-lg mt-2 text-center text-gray-900 line-clamp-1' title={job.title}>
        {job.title}
      </h4>
      
      <div className='flex flex-wrap justify-center items-center gap-2 mt-3 text-[11px] font-medium'>
        <span className='bg-blue-50/80 text-blue-700 border border-blue-100 px-2 py-1 rounded-full flex items-center gap-1'>
          <MapPin size={10} /> {job.location}
        </span>
        <span className='bg-indigo-50/80 text-indigo-700 border border-indigo-100 px-2 py-1 rounded-full flex items-center gap-1'>
          <Briefcase size={10} /> {job.level}
        </span>
      </div>
      
      <p className='text-gray-500 text-xs mt-4 text-center line-clamp-2' dangerouslySetInnerHTML={{ __html: job.description.slice(0, 100) + "..." }}></p>
      
      <div className='mt-5 grid grid-cols-2 gap-2 text-xs font-medium'>
        <button 
          onClick={() => { navigate(`/apply-job/${job._id}`); scrollTo(0, 0) }} 
          className='btn-primary flex items-center justify-center py-1.5'
        >
          Apply Now
        </button>
        <button 
          onClick={() => { navigate(`/apply-job/${job._id}`); scrollTo(0, 0) }} 
          className='btn-secondary flex items-center justify-center py-1.5'
        >
          Learn more
        </button>
      </div>
    </motion.div>
  )
}

export default JobCard
import React from 'react'
import { useParams } from 'react-router-dom'
import {AppContext} from '../context/AppContext'
import { useEffect,useState,useContext } from 'react'
import Loading from '../components/Loading'
import Navbar from '../components/Navbar'
import { assets } from '../assets/assets'
import Footer from '../components/Footer'
import kconvert from 'k-convert'
import moment from 'moment'
import JobCard from '../components/JobCard'
import ApplicationFormModal from '../components/ApplicationFormModal'
import { motion } from 'framer-motion'
import { MapPin, Briefcase, IndianRupee } from 'lucide-react'

const ApplyJob = () => {

  const { id } = useParams()

  const [JobData, setJobData] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { jobs } = useContext(AppContext)

  const fetchJob = async () => {
    const data=jobs.filter(job=>job._id=== id)
    if(data.length!==0){
      setJobData(data[0])
    }
  }
  
  useEffect(() => {
    fetchJob()
  }, [id,jobs])

 return JobData ? (
    <>
      <Navbar />

      <div className='min-h-screen flex flex-col py-10 container px-4 2xl:px-20 mx-auto'>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='bg-white text-black rounded-3xl w-full p-4 lg:p-10 shadow-[0_4px_30px_-4px_rgba(0,0,0,0.05)] border border-gray-100'
        >
          <div className='flex justify-center md:justify-between flex-wrap gap-8 items-center px-8 lg:px-14 py-16 mb-10 bg-gradient-to-br from-blue-50/80 to-indigo-50/50 border border-blue-100/50 rounded-3xl relative overflow-hidden'>
            <div className='absolute top-0 right-0 w-64 h-64 bg-indigo-200/30 rounded-full blur-3xl -mt-20 -mr-20'></div>
            <div className='absolute bottom-0 left-0 w-48 h-48 bg-blue-200/30 rounded-full blur-3xl -mb-10 -ml-10'></div>
            
            <div className='flex flex-col md:flex-row items-center relative z-10'>
               <div className='bg-white rounded-2xl p-6 mr-0 md:mr-6 shrink-0 shadow-sm border border-gray-100 mb-6 md:mb-0 hover-lift'>
                 <img className='h-20 w-20 object-contain' src={assets.company_icon} alt="" />
               </div>
              <div className='text-center md:text-left text-neutral-800'>
                <h1 className='text-3xl sm:text-5xl font-extrabold tracking-tight'>{JobData.title}</h1>
                <div className='flex flex-row flex-wrap justify-center md:justify-start gap-y-3 gap-x-6 items-center text-gray-600 mt-5 font-medium'>
                  <span className='flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm text-sm border border-gray-100'>
                    <img src={assets.suitcase_icon} alt="" className="w-4" />
                    {JobData.company || "General Company"}
                  </span>
                  <span className='flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm text-sm border border-gray-100'>
                    <MapPin size={16} className="text-blue-500" />
                    {JobData.location}
                  </span>
                  <span className='flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm text-sm border border-gray-100'>
                    <Briefcase size={16} className="text-blue-500" />
                    {JobData.level}
                  </span>
                  <span className='flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm text-sm border border-gray-100'>
                    <IndianRupee size={16} className="text-green-600" />
                    CTC: {kconvert.convertTo(JobData.salary)}
                  </span>
                </div>
              </div>
            </div>

            <div className='flex flex-col justify-center text-center md:text-right text-sm relative z-10'>
              <button 
                onClick={() => setIsModalOpen(true)}
                className='btn-primary px-12 py-3.5 text-base shadow-lg hover:shadow-indigo-500/25 mb-3'
              >
                Apply Now
              </button>
              <p className='text-gray-500 font-medium'>Posted {moment(JobData.date).fromNow()}</p>
            </div>

          </div>

          <div className='flex flex-col lg:flex-row justify-between items-start gap-10'>
            <div className='w-full lg:w-2/3'>
              <h2 className='font-extrabold text-2xl mb-6 text-gray-900 border-b border-gray-100 pb-4'>Job Description</h2>
              <div className='rich-text text-gray-600 leading-relaxed space-y-4' dangerouslySetInnerHTML={{ __html: JobData.description }}></div>
              <div className='mt-10 border-t border-gray-100 pt-8'>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className='btn-primary px-10'
                >
                  Apply Now
                </button>
              </div>
            </div>

            {/* Right Section More Jobs */}
            <div className='w-full lg:w-1/3 space-y-6'>
              <h2 className='font-extrabold text-xl text-gray-900 border-b border-gray-100 pb-4'>More active jobs</h2>
              <div className="space-y-4">
                {jobs.filter(job => job._id !== JobData._id)
                  .slice(0,4)
                  .map((job, index) => <JobCard key={index} job={job} />)}
              </div>
            </div>
          </div>

        </motion.div>
      </div>
      <ApplicationFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        job={JobData} 
      />
      <Footer />
    </>
  ) : (
    <Loading />
  )
}

export default ApplyJob

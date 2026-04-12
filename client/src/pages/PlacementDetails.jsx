import React, { useContext, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {
  FileCheck,
  Building2,
  IndianRupee,
  BriefcaseBusiness,
  GraduationCap,
  Calendar,
  Hash,
  UploadCloud
} from 'lucide-react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { AppContext } from '../context/AppContext'

const PlacementDetails = () => {
  const { backendUrl, fetchBackendData, offerLetters = [], user } = useContext(AppContext)

  const [formData, setFormData] = useState({
    name: user?.fullName || '',
    rollNumber: user?.rollNumber || '',
    branch: user?.branch || 'Computer Science and Engineering',
    year: user?.year || '2026',
    company: '',
    package: '',
    jobRole: '',
    placementType: 'On Campus'
  })

  const [offerLetterFile, setOfferLetterFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const alreadySubmitted = useMemo(() => {
    return offerLetters.find(item => item.rollNumber === formData.rollNumber)
  }, [offerLetters, formData.rollNumber])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setOfferLetterFile(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!offerLetterFile) {
      toast.error('Please upload your offer letter.')
      return
    }

    try {
      setLoading(true)

      const payload = new FormData()
      payload.append('name', formData.name)
      payload.append('rollNumber', formData.rollNumber)
      payload.append('branch', formData.branch)
      payload.append('year', formData.year)
      payload.append('company', formData.company)
      payload.append('package', formData.package)
      payload.append('jobRole', formData.jobRole)
      payload.append('placementType', formData.placementType)
      payload.append('offerLetter', offerLetterFile)

      await axios.post(`${backendUrl}/api/student/placement-details`, payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      toast.success('Placement details submitted successfully!')
      setOfferLetterFile(null)
      fetchBackendData?.()
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <ToastContainer position="bottom-right" />

      <div className="flex-grow flex items-center justify-center p-6 mt-2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-panel max-w-3xl w-full p-8 rounded-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

          <div className="flex items-center gap-4 mb-8">
            <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
              <FileCheck size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Placement Details</h1>
              <p className="text-gray-500 mt-1">
                Submit your placement details and upload your offer letter.
              </p>
            </div>
          </div>

          {alreadySubmitted && (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
              <p className="text-sm font-medium text-green-700">
                You have already submitted placement details for {alreadySubmitted.company}.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FileCheck size={16} className="text-gray-400" />
                  Student Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="glass-input"
                />
              </div>

              {/* Roll Number */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Hash size={16} className="text-gray-400" />
                  Roll Number
                </label>
                <input
                  type="text"
                  name="rollNumber"
                  required
                  value={formData.rollNumber}
                  onChange={handleChange}
                  placeholder="e.g. 230052010001"
                  className="glass-input"
                />
              </div>

              {/* Branch */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <GraduationCap size={16} className="text-gray-400" />
                  Branch
                </label>
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="glass-input appearance-none bg-white/70"
                >
                  <option>Computer Science and Engineering</option>
                  <option>Computer Science and Engineering (AI)</option>
                  <option>Computer Science and Engineering (SF)</option>
                  <option>Electronics and Communication Engineering</option>
                  <option>Electrical Engineering</option>
                  <option>Mechanical Engineering</option>
                  <option>Civil Engineering</option>
                  <option>Chemical Engineering</option>
                </select>
              </div>

              {/* Session / Passing Year */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Calendar size={16} className="text-gray-400" />
                  Session / Passing Year
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="glass-input appearance-none bg-white/70"
                >
                  <option>2024</option>
                  <option>2025</option>
                  <option>2026</option>
                  <option>2027</option>
                  <option>2028</option>
                </select>
              </div>

              {/* Company */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Building2 size={16} className="text-gray-400" />
                  Company Name
                </label>
                <input
                  type="text"
                  name="company"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. TCS, Infosys, Google"
                  className="glass-input"
                />
              </div>

              {/* Package */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <IndianRupee size={16} className="text-gray-400" />
                  Package
                </label>
                <input
                  type="text"
                  name="package"
                  required
                  value={formData.package}
                  onChange={handleChange}
                  placeholder="e.g. 8 LPA"
                  className="glass-input"
                />
              </div>

              {/* Job Role */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <BriefcaseBusiness size={16} className="text-gray-400" />
                  Job Role
                </label>
                <input
                  type="text"
                  name="jobRole"
                  value={formData.jobRole}
                  onChange={handleChange}
                  placeholder="e.g. Software Engineer"
                  className="glass-input"
                />
              </div>

              {/* Placement Type */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <BriefcaseBusiness size={16} className="text-gray-400" />
                  Placement Type
                </label>
                <select
                  name="placementType"
                  value={formData.placementType}
                  onChange={handleChange}
                  className="glass-input appearance-none bg-white/70"
                >
                  <option>On Campus</option>
                  <option>Off Campus</option>
                  <option>Internship + PPO</option>
                </select>
              </div>

              {/* Offer Letter Upload */}
              <div className="space-y-2 md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <UploadCloud size={16} className="text-gray-400" />
                  Upload Offer Letter
                </label>

                <label className="glass-input flex flex-col items-center justify-center text-center cursor-pointer min-h-[140px] border-2 border-dashed border-gray-300 bg-white/50 hover:bg-white/70 transition">
                  <UploadCloud size={28} className="text-blue-600 mb-3" />
                  <span className="text-sm font-medium text-gray-700">
                    Click to upload your offer letter
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    PDF, DOC, DOCX, PNG, JPG supported
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {offerLetterFile && (
                  <p className="text-sm text-green-600 font-medium mt-2">
                    Selected file: {offerLetterFile.name}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full md:w-auto flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Placement Details'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}

export default PlacementDetails
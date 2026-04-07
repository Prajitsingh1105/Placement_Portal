import { useContext, useEffect, useState, useMemo } from 'react'
import { assets, viewApplicationsPageData } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { Download, MoreVertical, Check, X as XIcon, FileText, Filter } from 'lucide-react'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'
import { motion } from 'framer-motion'

const ViewApplications = () => {

  const [applicants, setApplicants] = useState(viewApplicationsPageData)
  const [activeMenu, setActiveMenu] = useState(null)
  const [selectedJobFilter, setSelectedJobFilter] = useState('All')

  // Get unique job postings (Company + Job Title) for the filter dropdown
  const uniqueJobs = useMemo(() => {
    if (!applicants) return []
    // We combine Company and Job Title since each job posting is unique to a company
    const jobs = new Set(applicants.map(app => `${app.company || 'Unknown Company'} | ${app.jobTitle}`))
    return ['All', ...Array.from(jobs)]
  }, [applicants])

  // Filter applicants based on active selection
  const filteredApplicants = useMemo(() => {
    if (!applicants) return []
    if (selectedJobFilter === 'All') return applicants
    return applicants.filter(app => `${app.company || 'Unknown Company'} | ${app.jobTitle}` === selectedJobFilter)
  }, [applicants, selectedJobFilter])

  const handleExportCSV = () => {
    if (!filteredApplicants || filteredApplicants.length === 0) {
      toast.error("No data to export for this selection");
      return;
    }
    
    // Create CSV content
    const headers = ["Roll Number", "Name", "Branch", "Year", "Company", "Job Title", "Location", "Status"];
    const csvRows = [headers.join(",")];
    
    filteredApplicants.forEach(app => {
      const row = [
        `"${app.rollNumber || ''}"`,
        `"${app.name || ''}"`,
        `"${app.branch || ''}"`,
        `"${app.year || ''}"`,
        `"${app.company || ''}"`,
        `"${app.jobTitle || ''}"`,
        `"${app.location || ''}"`,
        `"${app.status || 'Pending'}"`
      ];
      csvRows.push(row.join(","));
    });
    
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `applications-${selectedJobFilter.replace(/[\s|]+/g, '-').toLowerCase()}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("CSV Exported successfully!");
  }

  const changeJobApplicationStatus = (id, status) => {
    const newApplicants = applicants.map(app => app._id === id ? { ...app, status } : app)
    setApplicants(newApplicants)
    setActiveMenu(null)
    toast.success(`Applicant status updated to ${status}`)
  }

  return applicants ? applicants.length === 0 ? (
    <div className='flex items-center justify-center h-[70vh]'>
      <p className='text-xl sm:text-2xl text-gray-500 font-medium'>No Applications Available</p>
    </div>
  ) : (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className='container mx-auto p-4 md:p-8'
    >
      <div className='glass-panel p-6 rounded-3xl mb-8 flex flex-col lg:flex-row justify-between items-center gap-6 shadow-sm border border-gray-100'>
        <div>
          <h2 className='text-2xl font-bold text-gray-800 tracking-tight'>Applicant Details</h2>
          <p className='text-gray-500 text-sm mt-1'>Manage and review all incoming student applications</p>
        </div>
        
        <div className='flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto'>
            {/* Filter Dropdown */}
            <div className="relative w-full sm:w-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter size={16} className="text-gray-400" />
                </div>
                <select 
                    value={selectedJobFilter}
                    onChange={(e) => setSelectedJobFilter(e.target.value)}
                    className="glass-input pl-10 pr-10 py-2.5 text-sm w-full font-medium"
                >
                    {uniqueJobs.map((job, index) => (
                        <option key={index} value={job}>
                            {job === 'All' ? 'Select Job Posting (All)' : job}
                        </option>
                    ))}
                </select>
            </div>

            <button 
            onClick={handleExportCSV}
            className='btn-primary flex items-center justify-center gap-2 py-2.5 px-6 shadow-md hover:shadow-lg transition-all rounded-xl w-full sm:w-auto shrink-0'
            >
            <Download size={18} /> Export CSV
            </button>
        </div>
      </div>

      <div className='glass-panel rounded-3xl overflow-hidden border border-gray-100 shadow-sm'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm text-left'>
            <thead className='bg-gray-50/80 border-b border-gray-100 text-gray-600 font-medium'>
              <tr>
                <th className='py-4 px-6'>Student Profile</th>
                <th className='py-4 px-6 text-center'>Roll No.</th>
                <th className='py-4 px-6 text-center'>Branch Details</th>
                <th className='py-4 px-6 max-sm:hidden'>Applied Role</th>
                <th className='py-4 px-6 text-center'>Resume</th>
                <th className='py-4 px-6 text-center'>Status</th>
                <th className='py-4 px-6 text-center'>Action</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {filteredApplicants.length > 0 ? filteredApplicants.map((applicant, index) => (
                <tr key={index} className='hover:bg-blue-50/30 transition-colors'>
                  <td className='py-4 px-6 flex items-center gap-4'>
                    <img className='w-10 h-10 rounded-full border-2 border-white shadow-sm' src={applicant.imgSrc} alt="" />
                    <span className='font-semibold text-gray-800'>{applicant.name}</span>
                  </td>
                  <td className='py-4 px-6 text-center text-gray-600 font-medium'>
                    {applicant.rollNumber || 'N/A'}
                  </td>
                  <td className='py-4 px-6 text-center'>
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-gray-700">{applicant.branch || 'N/A'}</span>
                      <span className="text-xs text-gray-500">{applicant.year || 'N/A'}</span>
                    </div>
                  </td>
                  <td className='py-4 px-6 max-sm:hidden'>
                    <span className="font-medium text-gray-700">{applicant.jobTitle}</span>
                    <span className="block text-xs text-gray-400 mt-0.5">{applicant.company} • {applicant.location}</span>
                  </td>
                  <td className='py-4 px-6 text-center'>
                    <a href={applicant.resume || '#'} target='_blank' rel="noreferrer"
                      className='inline-flex items-center justify-center w-10 h-10 bg-indigo-50 text-indigo-500 rounded-full hover:bg-indigo-100 transition-colors tooltip'
                      title="View Resume"
                    >
                      <FileText size={18} />
                    </a>
                  </td>
                  <td className='py-4 px-6 text-center'>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold
                      ${applicant.status === 'Accepted' ? 'bg-green-100 text-green-700 border border-green-200' : 
                        applicant.status === 'Rejected' ? 'bg-red-100 text-red-700 border border-red-200' : 
                        'bg-blue-50 text-blue-700 border border-blue-200'}`}
                    >
                      {applicant.status || 'Pending'}
                    </span>
                  </td>
                  <td className='py-4 px-6 text-center relative'>
                    {(!applicant.status || applicant.status === "Pending") ? (
                      <div className='relative inline-block text-left'>
                        <button 
                          onClick={() => setActiveMenu(activeMenu === applicant._id ? null : applicant._id)}
                          className='p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors'
                        >
                          <MoreVertical size={18} />
                        </button>
                        
                        {activeMenu === applicant._id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)}></div>
                            <div className='absolute right-10 top-2 z-20 w-36 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden py-1'>
                              <button 
                                onClick={() => changeJobApplicationStatus(applicant._id, 'Accepted')} 
                                className='w-full flex items-center gap-2 px-4 py-2 text-sm text-green-600 hover:bg-green-50'
                              >
                                <Check size={16} /> Accept
                              </button>
                              <button 
                                onClick={() => changeJobApplicationStatus(applicant._id, 'Rejected')} 
                                className='w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50'
                              >
                                <XIcon size={16} /> Reject
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">Reviewed</span>
                    )}
                  </td>
                </tr>
              )) : (
                  <tr>
                      <td colSpan="7" className="py-12 text-center text-gray-500 font-medium">
                          No applicants found for the selected job posting.
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  ) : <Loading />
}

export default ViewApplications
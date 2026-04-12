import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { motion, AnimatePresence } from 'framer-motion'
import { FileCheck, Search, Plus, X, Trash2, Eye, Briefcase } from 'lucide-react'
import moment from 'moment'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlacementRecords = () => {
    const { offerLetters, studentRecords, backendUrl, fetchBackendData } = useContext(AppContext)

    const [activeTab, setActiveTab] = useState('verified')

    const [search, setSearch] = useState('')
    const [branchFilter, setBranchFilter] = useState('All')
    const [sessionFilter, setSessionFilter] = useState('All')
    const [statusFilter, setStatusFilter] = useState('All')
    const [dateFilter, setDateFilter] = useState('All')

    const [showAddModal, setShowAddModal] = useState(false)
    const [viewLetterUrl, setViewLetterUrl] = useState(null)
    const [newPlacement, setNewPlacement] = useState({
        name: '',
        rollNumber: '',
        branch: '',
        year: '',
        company: '',
        package: '',
        letterUrl: ''
    })

    // ================= DATE FILTER HELPER =================
    const matchDateFilter = (dateValue) => {
        if (dateFilter === 'All') return true
        if (!dateValue) return false

        if (dateFilter === 'today') return moment(dateValue).isSame(moment(), 'day')
        if (dateFilter === 'week') return moment(dateValue).isSame(moment(), 'week')
        if (dateFilter === 'month') return moment(dateValue).isSame(moment(), 'month')

        return true
    }

    // ================= VERIFIED DATA =================
    const filteredRecords = offerLetters.filter(record => {
        const matchesSearch =
            record.name?.toLowerCase().includes(search.toLowerCase()) ||
            record.rollNumber?.includes(search)

        const matchesBranch =
            branchFilter === 'All' || record.branch === branchFilter

        const matchesSession =
            sessionFilter === 'All' || record.year === sessionFilter

        const matchesDate = matchDateFilter(record.createdAt)

        return matchesSearch && matchesBranch && matchesSession && matchesDate
    })

    // ================= MATCHER DATA =================
    const placementData = studentRecords.map(record => {
        const matchingOffer = offerLetters.find(o => o.rollNumber === record.rollNumber)
        const hasUploaded = !!matchingOffer

        return {
            ...record,
            hasUploaded,
            uploadDate: matchingOffer?.createdAt || null
        }
    })

    const filteredMatcher = placementData.filter(record => {
        const matchesSearch =
            record.name?.toLowerCase().includes(search.toLowerCase()) ||
            record.rollNumber?.includes(search)

        const matchesBranch =
            branchFilter === 'All' || record.branch === branchFilter

        const matchesSession =
            sessionFilter === 'All' || record.year === sessionFilter

        const matchesStatus =
            statusFilter === 'All' ||
            (statusFilter === 'Uploaded' && record.hasUploaded) ||
            (statusFilter === 'Pending' && !record.hasUploaded)

        const matchesDate = matchDateFilter(record.uploadDate)

        return matchesSearch && matchesBranch && matchesSession && matchesStatus && matchesDate
    })

    // ================= FILTER OPTIONS =================
    const branches = ['All', ...new Set([
        ...offerLetters.map(r => r.branch).filter(Boolean),
        ...studentRecords.map(r => r.branch).filter(Boolean)
    ])]

    const sessions = ['All', ...new Set([
        ...offerLetters.map(r => r.year).filter(Boolean),
        ...studentRecords.map(r => r.year).filter(Boolean)
    ])]

    const matcherStatusOptions = ['All', 'Uploaded', 'Pending']

    const dateOptions = [
        { label: 'All', value: 'All' },
        { label: 'Today', value: 'today' },
        { label: 'This Week', value: 'week' },
        { label: 'This Month', value: 'month' }
    ]

    // ================= ACTIONS =================
    const handleAddPlacement = async (e) => {
        e.preventDefault()
        try {
            await axios.post(`${backendUrl}/api/admin/placements`, newPlacement)
            toast.success('Offer Letter Record Added!')
            setShowAddModal(false)
            setNewPlacement({
                name: '',
                rollNumber: '',
                branch: '',
                year: '',
                company: '',
                package: '',
                letterUrl: ''
            })
            fetchBackendData()
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    const handleDeletePlacement = async (id) => {
        if (!window.confirm('Are you sure you want to remove this placement record?')) return
        try {
            await axios.delete(`${backendUrl}/api/admin/placements/${id}`)
            fetchBackendData()
            toast.success('Placement record deleted.')
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    const formatDate = (dateString) => {
        return dateString ? moment(dateString).format('DD MMM YYYY') : 'N/A'
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className='container mx-auto p-2 sm:p-4'
        >
            {/* ================= TABS ================= */}
            <div className="flex border-b border-gray-200 mb-6 gap-6">
                <button
                    onClick={() => setActiveTab('verified')}
                    className={`flex items-center gap-2 pb-3 font-semibold transition-colors ${
                        activeTab === 'verified'
                            ? 'text-indigo-600 border-b-2 border-indigo-600'
                            : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                    <FileCheck size={18} /> Verified Placements
                </button>

                <button
                    onClick={() => setActiveTab('matcher')}
                    className={`flex items-center gap-2 pb-3 font-semibold transition-colors ${
                        activeTab === 'matcher'
                            ? 'text-indigo-600 border-b-2 border-indigo-600'
                            : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                    <Briefcase size={18} /> Placement Matcher
                </button>
            </div>

            {/* ================= HEADER ================= */}
            <div className='glass-panel p-6 rounded-3xl mb-8 flex flex-col gap-6 shadow-sm border border-gray-100'>
                <div className='flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-800 tracking-tight'>
                            {activeTab === 'verified' ? 'Verified Placements' : 'Placement Matcher'}
                        </h2>
                        <p className='text-gray-500 text-sm mt-1'>
                            {activeTab === 'verified'
                                ? 'Archive of student offer letters with filters for branch, session and upload date.'
                                : 'Cross-check students on the basis of branch, session, status and upload date.'}
                        </p>
                    </div>

                    {activeTab === 'verified' && (
                        <button
                            onClick={() => setShowAddModal(true)}
                            className='btn-primary px-5 py-2.5 flex items-center gap-2 shadow-md rounded-xl text-sm'
                        >
                            <Plus size={16} /> Add Record
                        </button>
                    )}
                </div>

                {/* ================= SEARCH + FILTERS ================= */}
                <div className='flex flex-wrap items-end gap-4'>
                    <div className="flex flex-col gap-1 min-w-[220px]">
                        <label className='text-xs font-semibold text-gray-600'>Search</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={16} className="text-gray-400" />
                            </div>
                            <input
                                placeholder="Search Student / Roll No."
                                className="glass-input pl-9 pr-4 py-2.5 text-sm w-full font-medium"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 min-w-[150px]">
                        <label className='text-xs font-semibold text-gray-600'>Branch</label>
                        <select
                            value={branchFilter}
                            onChange={(e) => setBranchFilter(e.target.value)}
                            className="glass-input px-4 py-2.5 text-sm font-medium"
                        >
                            {branches.map(branch => (
                                <option key={branch} value={branch}>{branch}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1 min-w-[150px]">
                        <label className='text-xs font-semibold text-gray-600'>Session</label>
                        <select
                            value={sessionFilter}
                            onChange={(e) => setSessionFilter(e.target.value)}
                            className="glass-input px-4 py-2.5 text-sm font-medium"
                        >
                            {sessions.map(session => (
                                <option key={session} value={session}>{session}</option>
                            ))}
                        </select>
                    </div>

                    {activeTab === 'verified' && (
                        <div className="flex flex-col gap-1 min-w-[170px]">
                            <label className='text-xs font-semibold text-gray-600'>Date of Upload</label>
                            <select
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="glass-input px-4 py-2.5 text-sm font-medium"
                            >
                                {dateOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {activeTab === 'matcher' && (
                        <>
                            <div className="flex flex-col gap-1 min-w-[150px]">
                                <label className='text-xs font-semibold text-gray-600'>Status</label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="glass-input px-4 py-2.5 text-sm font-medium"
                                >
                                    {matcherStatusOptions.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-1 min-w-[170px]">
                                <label className='text-xs font-semibold text-gray-600'>Date of Upload</label>
                                <select
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value)}
                                    className="glass-input px-4 py-2.5 text-sm font-medium"
                                >
                                    {dateOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* ================= TABLE ================= */}
            <div className='glass-panel rounded-3xl overflow-hidden border border-gray-100 bg-white/50 shadow-sm'>
                <div className='overflow-x-auto'>
                    <table className='w-full text-sm text-left whitespace-nowrap'>
                        {activeTab === 'verified' && (
                            <>
                                <thead className='bg-gray-50/80 border-b border-gray-100 text-gray-600 font-medium uppercase tracking-wider text-xs'>
                                    <tr>
                                        <th className='py-4 px-6 text-center w-16'>S.No</th>
                                        <th className='py-4 px-6'>Name</th>
                                        <th className='py-4 px-6 text-center'>Roll Number</th>
                                        <th className='py-4 px-6 text-center'>Branch</th>
                                        <th className='py-4 px-6 text-center'>Session</th>
                                        <th className='py-4 px-6 text-center'>Company</th>
                                        <th className='py-4 px-6 text-center'>Package</th>
                                        <th className='py-4 px-6 text-center'>Date of Upload</th>
                                        <th className='py-4 px-6 text-center'>Offer Letter</th>
                                    </tr>
                                </thead>

                                <tbody className='divide-y divide-gray-100'>
                                    {filteredRecords.map((record, index) => (
                                        <tr key={record._id || index} className='hover:bg-blue-50/20 transition-colors'>
                                            <td className='py-4 px-6 text-center'>{index + 1}</td>
                                            <td className='py-4 px-6 font-bold'>{record.name}</td>
                                            <td className='py-4 px-6 text-center'>{record.rollNumber}</td>
                                            <td className='py-4 px-6 text-center'>{record.branch}</td>
                                            <td className='py-4 px-6 text-center'>{record.year}</td>
                                            <td className='py-4 px-6 text-center'>{record.company}</td>
                                            <td className='py-4 px-6 text-center text-green-600 font-bold'>{record.package}</td>
                                            <td className='py-4 px-6 text-center'>{formatDate(record.createdAt)}</td>
                                            <td className='py-4 px-6 text-center flex justify-center gap-3'>
                                                <button
                                                    onClick={() => handleDeletePlacement(record._id)}
                                                    className="w-9 h-9 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setViewLetterUrl(record.letterUrl)}
                                                    className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </>
                        )}

                        {activeTab === 'matcher' && (
                            <>
                                <thead className='bg-gray-50/80 border-b border-gray-100 text-gray-600 font-medium uppercase tracking-wider text-xs'>
                                    <tr>
                                        <th className='py-4 px-6'>Roll Number</th>
                                        <th className='py-4 px-6'>Name</th>
                                        <th className='py-4 px-6 text-center'>Branch</th>
                                        <th className='py-4 px-6 text-center'>Session</th>
                                        <th className='py-4 px-6 text-center'>Status</th>
                                        <th className='py-4 px-6 text-center'>Date of Upload</th>
                                    </tr>
                                </thead>

                                <tbody className='divide-y divide-gray-100'>
                                    {filteredMatcher.map((record, index) => (
                                        <tr
                                            key={record.rollNumber || index}
                                            className={`transition-colors ${
                                                record.hasUploaded
                                                    ? 'hover:bg-green-50/10'
                                                    : 'bg-red-50/10 hover:bg-red-50/30'
                                            }`}
                                        >
                                            <td className='py-3 px-6'>{record.rollNumber}</td>
                                            <td className='py-3 px-6 font-bold'>{record.name}</td>
                                            <td className='py-3 px-6 text-center'>{record.branch}</td>
                                            <td className='py-3 px-6 text-center'>{record.year}</td>
                                            <td className='py-3 px-6 text-center'>
                                                {record.hasUploaded ? (
                                                    <span className='bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs'>
                                                        Uploaded
                                                    </span>
                                                ) : (
                                                    <span className='bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs'>
                                                        Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td className='py-3 px-6 text-center'>
                                                {record.hasUploaded ? formatDate(record.uploadDate) : 'N/A'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </>
                        )}
                    </table>
                </div>
            </div>

            {/* ================= VIEW LETTER MODAL ================= */}
            <AnimatePresence>
                {viewLetterUrl && (
                    <motion.div
                        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-2xl w-full max-w-5xl h-[85vh] overflow-hidden shadow-2xl relative"
                        >
                            <button
                                onClick={() => setViewLetterUrl(null)}
                                className="absolute top-4 right-4 z-10 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-full p-2"
                            >
                                <X size={18} />
                            </button>
                            <iframe
                                src={viewLetterUrl}
                                title="Offer Letter"
                                className="w-full h-full"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ================= ADD MODAL ================= */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative"
                        >
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 rounded-full p-2"
                            >
                                <X size={18} />
                            </button>

                            <h3 className="text-xl font-bold text-gray-800 mb-6">Add Placement Record</h3>

                            <form onSubmit={handleAddPlacement} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Student Name"
                                    value={newPlacement.name}
                                    onChange={(e) => setNewPlacement({ ...newPlacement, name: e.target.value })}
                                    className="glass-input px-4 py-3"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Roll Number"
                                    value={newPlacement.rollNumber}
                                    onChange={(e) => setNewPlacement({ ...newPlacement, rollNumber: e.target.value })}
                                    className="glass-input px-4 py-3"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Branch"
                                    value={newPlacement.branch}
                                    onChange={(e) => setNewPlacement({ ...newPlacement, branch: e.target.value })}
                                    className="glass-input px-4 py-3"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Session"
                                    value={newPlacement.year}
                                    onChange={(e) => setNewPlacement({ ...newPlacement, year: e.target.value })}
                                    className="glass-input px-4 py-3"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Company"
                                    value={newPlacement.company}
                                    onChange={(e) => setNewPlacement({ ...newPlacement, company: e.target.value })}
                                    className="glass-input px-4 py-3"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Package"
                                    value={newPlacement.package}
                                    onChange={(e) => setNewPlacement({ ...newPlacement, package: e.target.value })}
                                    className="glass-input px-4 py-3"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Offer Letter URL"
                                    value={newPlacement.letterUrl}
                                    onChange={(e) => setNewPlacement({ ...newPlacement, letterUrl: e.target.value })}
                                    className="glass-input px-4 py-3 sm:col-span-2"
                                    required
                                />

                                <button
                                    type="submit"
                                    className="btn-primary px-5 py-3 rounded-xl text-sm sm:col-span-2"
                                >
                                    Save Record
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export default PlacementRecords
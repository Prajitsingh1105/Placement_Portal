import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { motion, AnimatePresence } from 'framer-motion'
import { FileCheck, Search, Filter, Download, Plus, X, Trash2 } from 'lucide-react'
import moment from 'moment'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlacementRecords = () => {
    const { offerLetters, backendUrl, fetchBackendData } = useContext(AppContext)
    const [search, setSearch] = useState('')
    const [branchFilter, setBranchFilter] = useState('All')
    const [companyFilter, setCompanyFilter] = useState('All')
    const [yearFilter, setYearFilter] = useState('All')

    const [showAddModal, setShowAddModal] = useState(false)
    const [newPlacement, setNewPlacement] = useState({ name: '', rollNumber: '', branch: '', year: '', company: '', package: '', letterUrl: '' })

    const handleAddPlacement = async (e) => {
        e.preventDefault()
        try {
            await axios.post(`${backendUrl}/api/admin/placements`, newPlacement)
            toast.success("Offer Letter Record Added!")
            setShowAddModal(false)
            setNewPlacement({ name: '', rollNumber: '', branch: '', year: '', company: '', package: '', letterUrl: '' })
            fetchBackendData()
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleDeletePlacement = async (id) => {
        if (!window.confirm("Are you sure you want to remove this placement record?")) return;
        try {
            await axios.delete(`${backendUrl}/api/admin/placements/${id}`)
            fetchBackendData()
            toast.success("Placement record deleted.")
        } catch (error) { toast.error(error.message) }
    }

    const filteredRecords = offerLetters.filter(record => {
        const matchesSearch = record.name.toLowerCase().includes(search.toLowerCase()) || record.rollNumber.includes(search)
        const matchesBranch = branchFilter === 'All' || record.branch === branchFilter
        const matchesCompany = companyFilter === 'All' || record.company === companyFilter
        const matchesYear = yearFilter === 'All' || record.year === yearFilter
        return matchesSearch && matchesBranch && matchesCompany && matchesYear
    })

    // unique lists for dropdowns
    const branches = ['All', ...new Set(offerLetters.map(r => r.branch))]
    const companiesList = ['All', ...new Set(offerLetters.map(r => r.company))]
    const years = ['All', ...new Set(offerLetters.map(r => r.year))]

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className='container mx-auto p-2 sm:p-4'
        >
            <div className='glass-panel p-6 rounded-3xl mb-8 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 shadow-sm border border-gray-100'>
                <div>
                    <h2 className='text-2xl font-bold text-gray-800 tracking-tight'>Verified Placements</h2>
                    <p className='text-gray-500 text-sm mt-1'>Archive of student offer letters filterable by batch and company.</p>
                </div>
                
                <div className='flex flex-wrap items-center gap-3 w-full xl:w-auto'>
                    <div className="relative flex-grow sm:flex-grow-0 sm:w-48">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-gray-400" />
                        </div>
                        <input 
                            placeholder="Search Student/Roll..."
                            className="glass-input pl-9 pr-4 py-2.5 text-sm w-full font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    
                    <select 
                        value={branchFilter}
                        onChange={(e) => setBranchFilter(e.target.value)}
                        className="glass-input px-4 py-2.5 text-sm font-medium min-w-[120px]"
                    >
                        {branches.map(b => <option key={`branch-${b}`} value={b}>{b === 'All' ? 'All Branches' : b}</option>)}
                    </select>

                    <select 
                        value={companyFilter}
                        onChange={(e) => setCompanyFilter(e.target.value)}
                        className="glass-input px-4 py-2.5 text-sm font-medium min-w-[120px]"
                    >
                        {companiesList.map(c => <option key={`company-${c}`} value={c}>{c === 'All' ? 'All Companies' : c}</option>)}
                    </select>

                    <select 
                        value={yearFilter}
                        onChange={(e) => setYearFilter(e.target.value)}
                        className="glass-input px-4 py-2.5 text-sm font-medium min-w-[120px]"
                    >
                        {years.map(y => <option key={`year-${y}`} value={y}>{y === 'All' ? 'All Years' : y}</option>)}
                    </select>

                    <button 
                        onClick={() => setShowAddModal(true)}
                        className='btn-primary px-5 py-2.5 flex items-center justify-center gap-2 shadow-md hover:shadow-lg rounded-xl flex-shrink-0 text-sm'
                    >
                        <Plus size={16} /> Add Record
                    </button>
                </div>
            </div>

            <div className='glass-panel rounded-3xl overflow-hidden border border-gray-100 bg-white/50 shadow-sm'>
                <div className='overflow-x-auto'>
                    <table className='w-full text-sm text-left whitespace-nowrap'>
                        <thead className='bg-gray-50/80 border-b border-gray-100 text-gray-600 font-medium uppercase tracking-wider text-xs'>
                            <tr>
                                <th className='py-4 px-6'>Student Details</th>
                                <th className='py-4 px-6 text-center'>Company</th>
                                <th className='py-4 px-6 text-center'>Package</th>
                                <th className='py-4 px-6 text-center'>Date Verified</th>
                                <th className='py-4 px-6 text-center'>Offer Letter</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-100'>
                            {filteredRecords.map((record, index) => (
                                <tr key={index} className='hover:bg-blue-50/20 transition-colors'>
                                    <td className='py-4 px-6'>
                                        <div>
                                            <p className='font-bold text-gray-800 text-base'>{record.name}</p>
                                            <p className='text-xs text-gray-500 font-semibold'>{record.rollNumber} • {record.branch} '{record.year}</p>
                                        </div>
                                    </td>
                                    <td className='py-4 px-6 text-center'>
                                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                                            {record.company}
                                        </span>
                                    </td>
                                    <td className='py-4 px-6 text-center'>
                                        <span className="font-extrabold text-green-600">{record.package}</span>
                                    </td>
                                    <td className='py-4 px-6 text-center'>
                                        <span className="text-gray-500 font-medium">{moment(record.date).format('MMMM Do YYYY')}</span>
                                    </td>
                                    <td className='py-4 px-6 text-center'>
                                        <div className="flex justify-center">
                                            <a 
                                                href={record.letterUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors shadow-sm"
                                                title="View/Download Offer Letter"
                                            >
                                                <Download size={16} />
                                            </a>
                                            <button 
                                                onClick={() => handleDeletePlacement(record._id)}
                                                className="w-9 h-9 ml-2 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors shadow-sm"
                                                title="Delete Record"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredRecords.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-gray-500 font-medium">
                                        No placement records match your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" />
                        
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="glass-panel w-full max-w-lg rounded-3xl shadow-2xl relative z-10 p-6 overflow-hidden max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">Add Offer Letter Record</h3>
                                    <p className="text-sm text-gray-500">Record a successful placement</p>
                                </div>
                                <button onClick={() => setShowAddModal(false)} className="p-2 bg-gray-50 text-gray-400 hover:text-gray-600 rounded-full"><X size={20}/></button>
                            </div>

                            <form onSubmit={handleAddPlacement} className="space-y-4 text-sm">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-1">Student Name</label>
                                        <input required type="text" className="glass-input w-full p-3" value={newPlacement.name} onChange={e => setNewPlacement({...newPlacement, name: e.target.value})} placeholder="Full Name" />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-1">Roll Number</label>
                                        <input required type="text" className="glass-input w-full p-3" value={newPlacement.rollNumber} onChange={e => setNewPlacement({...newPlacement, rollNumber: e.target.value})} placeholder="Roll No." />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-1">Branch</label>
                                        <input required type="text" className="glass-input w-full p-3" value={newPlacement.branch} onChange={e => setNewPlacement({...newPlacement, branch: e.target.value})} placeholder="e.g. CSE, IT" />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-1">Graduation Year</label>
                                        <input required type="text" className="glass-input w-full p-3" value={newPlacement.year} onChange={e => setNewPlacement({...newPlacement, year: e.target.value})} placeholder="e.g. 2024" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-1">Company</label>
                                        <input required type="text" className="glass-input w-full p-3" value={newPlacement.company} onChange={e => setNewPlacement({...newPlacement, company: e.target.value})} placeholder="Company Name" />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-1">Package</label>
                                        <input required type="text" className="glass-input w-full p-3" value={newPlacement.package} onChange={e => setNewPlacement({...newPlacement, package: e.target.value})} placeholder="e.g. 12 LPA" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1">Offer Letter Link (PDF/Drive)</label>
                                    <input type="text" className="glass-input w-full p-3" value={newPlacement.letterUrl} onChange={e => setNewPlacement({...newPlacement, letterUrl: e.target.value})} placeholder="Optional external URL" />
                                    <p className="text-xs text-gray-400 mt-1">Provide a valid secure link if you have the digital copy.</p>
                                </div>

                                <button type="submit" className="btn-primary w-full py-3 mt-4 rounded-xl shadow-lg">Save Placement</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export default PlacementRecords

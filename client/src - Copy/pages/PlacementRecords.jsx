import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'
import { FileCheck, Search, Filter, Download } from 'lucide-react'
import moment from 'moment'

const PlacementRecords = () => {
    const { offerLetters } = useContext(AppContext)
    const [search, setSearch] = useState('')
    const [branchFilter, setBranchFilter] = useState('All')
    const [companyFilter, setCompanyFilter] = useState('All')
    const [yearFilter, setYearFilter] = useState('All')

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
        </motion.div>
    )
}

export default PlacementRecords

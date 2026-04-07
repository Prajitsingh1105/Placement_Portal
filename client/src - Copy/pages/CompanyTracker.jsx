import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'
import { Building2, Search, Filter, ShieldAlert, BadgeCheck, MoreHorizontal } from 'lucide-react'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const CompanyTracker = () => {
    const { companies, setCompanies } = useContext(AppContext)
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('All')

    const handleUpdateTag = (id, newTag) => {
        setCompanies(companies.map(c => c._id === id ? { ...c, tag: newTag } : c))
        if(newTag.includes('Fraud')) toast.error(`Company flagged as Fraud!`)
        else toast.success(`Status updated to ${newTag}`)
    }

    const filteredCompanies = companies.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase())
        const matchesFilter = filter === 'All' || c.tag === filter
        return matchesSearch && matchesFilter
    })

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className='container mx-auto p-2 sm:p-4'
        >
            <div className='glass-panel p-6 rounded-3xl mb-8 flex flex-col lg:flex-row justify-between items-center gap-6 shadow-sm border border-gray-100'>
                <div>
                    <h2 className='text-2xl font-bold text-gray-800 tracking-tight'>Company Intelligence</h2>
                    <p className='text-gray-500 text-sm mt-1'>Track recruiting partners and blacklist fraudulent organizations.</p>
                </div>
                
                <div className='flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto'>
                    <div className="relative w-full sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-gray-400" />
                        </div>
                        <input 
                            placeholder="Search companies..."
                            className="glass-input pl-9 pr-4 py-2.5 text-sm w-full font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    
                    <div className="relative w-full sm:w-auto">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Filter size={16} className="text-gray-400" />
                        </div>
                        <select 
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="glass-input pl-9 pr-8 py-2.5 text-sm w-full font-medium"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Upcoming Drive">Upcoming Drive</option>
                            <option value="In Discussion">In Discussion</option>
                            <option value="Fraud/Blacklisted">Fraud/Blacklisted</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className='glass-panel rounded-3xl overflow-hidden border border-gray-100 bg-white/50 shadow-sm'>
                <div className='overflow-x-auto'>
                    <table className='w-full text-sm text-left whitespace-nowrap'>
                        <thead className='bg-gray-50/80 border-b border-gray-100 text-gray-600 font-medium uppercase tracking-wider text-xs'>
                            <tr>
                                <th className='py-4 px-6'>Organization</th>
                                <th className='py-4 px-6 text-center'>Sector</th>
                                <th className='py-4 px-6 text-center'>Current Status</th>
                                <th className='py-4 px-6 text-center'>Quick Actions</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-100'>
                            {filteredCompanies.map((company, index) => (
                                <tr key={index} className='hover:bg-blue-50/20 transition-colors'>
                                    <td className='py-4 px-6'>
                                        <div className='flex items-center gap-4'>
                                            <div className='w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center p-2'>
                                                <img src={company.logo} alt="" className='max-w-full max-h-full object-contain' />
                                            </div>
                                            <span className='font-bold text-gray-800 text-base'>{company.name}</span>
                                        </div>
                                    </td>
                                    <td className='py-4 px-6 text-center'>
                                        <span className="text-gray-600 font-medium">{company.sector}</span>
                                    </td>
                                    <td className='py-4 px-6 text-center'>
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold
                                            ${company.tag.includes('Fraud') ? 'bg-red-100 text-red-700 border border-red-200' : 
                                              company.tag === 'Upcoming Drive' ? 'bg-green-100 text-green-700 border border-green-200' : 
                                              'bg-blue-100 text-blue-700 border border-blue-200'}`}
                                        >
                                            {company.tag.includes('Fraud') && <ShieldAlert size={12} />}
                                            {company.tag}
                                        </span>
                                    </td>
                                    <td className='py-4 px-6 text-center'>
                                        <div className="flex items-center justify-center gap-2">
                                            <button 
                                                onClick={() => handleUpdateTag(company._id, 'Upcoming Drive')}
                                                title="Mark as Upcoming Drive"
                                                className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors"
                                            >
                                                <BadgeCheck size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleUpdateTag(company._id, 'Fraud/Blacklisted')}
                                                title="Mark as Fraud"
                                                className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors"
                                            >
                                                <ShieldAlert size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredCompanies.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="py-12 text-center text-gray-500 font-medium">
                                        No companies found matching your criteria.
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

export default CompanyTracker

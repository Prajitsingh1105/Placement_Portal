import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'
import { Search, UserX, UserCheck, ShieldAlert, Filter } from 'lucide-react'
import { toast } from 'react-toastify'

const StudentDatabase = () => {
    const { students, setStudents } = useContext(AppContext)
    const [search, setSearch] = useState('')
    const [branchFilter, setBranchFilter] = useState('All')
    const [statusFilter, setStatusFilter] = useState('All')

    const handleToggleBlacklist = (id) => {
        setStudents(students.map(s => {
            if (s._id === id) {
                const isNowBlacklisted = !s.isBlacklisted;
                if (isNowBlacklisted) toast.error(`${s.name} has been blacklisted.`)
                else toast.success(`${s.name} blacklist lifted.`)
                return { ...s, isBlacklisted: isNowBlacklisted }
            }
            return s
        }))
    }

    const filteredStudents = students.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNumber.includes(search)
        const matchesBranch = branchFilter === 'All' || s.branch === branchFilter
        const matchesStatus = statusFilter === 'All' || 
            (statusFilter === 'Active' && !s.isBlacklisted) || 
            (statusFilter === 'Blacklisted' && s.isBlacklisted)
        
        return matchesSearch && matchesBranch && matchesStatus
    })

    const branches = ['All', ...new Set(students.map(s => s.branch))]

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className='container mx-auto p-2 sm:p-4'
        >
            <div className='glass-panel p-6 rounded-3xl mb-8 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 shadow-sm border border-gray-100'>
                <div>
                    <h2 className='text-2xl font-bold text-gray-800 tracking-tight'>Student Directory</h2>
                    <p className='text-gray-500 text-sm mt-1'>Manage registered candidates and enforce strict disciplinary actions.</p>
                </div>
                
                <div className='flex flex-wrap items-center gap-3 w-full xl:w-auto'>
                    <div className="relative flex-grow sm:flex-grow-0 sm:w-56">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-gray-400" />
                        </div>
                        <input 
                            placeholder="Search Name or Roll No..."
                            className="glass-input pl-9 pr-4 py-2.5 text-sm w-full font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Filter size={14} className="text-gray-400" />
                        </div>
                        <select 
                            value={branchFilter}
                            onChange={(e) => setBranchFilter(e.target.value)}
                            className="glass-input pl-9 pr-4 py-2.5 text-sm font-medium min-w-[130px]"
                        >
                            {branches.map(b => (
                                <option key={`branch-${b}`} value={b}>{b === 'All' ? 'All Branches' : b}</option>
                            ))}
                        </select>
                    </div>

                    <div className="relative">
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="glass-input px-4 py-2.5 text-sm font-medium min-w-[130px]"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Active">🟢 Active Only</option>
                            <option value="Blacklisted">🔴 Blacklisted</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className='glass-panel rounded-3xl overflow-hidden border border-gray-100 bg-white/50 shadow-sm'>
                <div className='overflow-x-auto'>
                    <table className='w-full text-sm text-left whitespace-nowrap'>
                        <thead className='bg-gray-50/80 border-b border-gray-100 text-gray-600 font-bold uppercase tracking-wider text-xs'>
                            <tr>
                                <th className='py-4 px-6'>Roll Number</th>
                                <th className='py-4 px-6'>Full Name</th>
                                <th className='py-4 px-6'>Branch</th>
                                <th className='py-4 px-6 text-center'>Account Status</th>
                                <th className='py-4 px-6 text-center'>Quick Action</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-100'>
                            {filteredStudents.map((student, index) => (
                                <tr key={index} className={`transition-colors ${student.isBlacklisted ? 'bg-red-50/30 hover:bg-red-50/50' : 'hover:bg-blue-50/20'}`}>
                                    <td className='py-3 px-6 font-semibold text-gray-600'>
                                        {student.rollNumber}
                                    </td>
                                    <td className='py-3 px-6'>
                                        <span className={`font-bold ${student.isBlacklisted ? 'text-red-700' : 'text-gray-800'}`}>
                                            {student.name}
                                        </span>
                                    </td>
                                    <td className='py-3 px-6'>
                                        <span className="text-gray-500 font-medium">
                                            {student.branch}
                                        </span>
                                    </td>
                                    <td className='py-3 px-6 text-center'>
                                        {student.isBlacklisted ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                                                <ShieldAlert size={12} /> BANNED
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                                                <UserCheck size={12} /> ACTIVE
                                            </span>
                                        )}
                                    </td>
                                    <td className='py-3 px-6 text-center'>
                                        <div className="flex items-center justify-center">
                                            <button 
                                                onClick={() => handleToggleBlacklist(student._id)}
                                                title={student.isBlacklisted ? "Lift Ban" : "Blacklist Student"}
                                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm ${
                                                    student.isBlacklisted 
                                                    ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800' 
                                                    : 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white'
                                                }`}
                                            >
                                                {student.isBlacklisted ? <UserCheck size={14} /> : <UserX size={14} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredStudents.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-gray-500 font-medium">
                                        No students perfectly matched your filters.
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

export default StudentDatabase

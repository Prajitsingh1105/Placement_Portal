import React, { useContext, useState, useRef } from 'react'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'
import { Search, UserX, UserCheck, ShieldAlert, Filter, Upload, FileSpreadsheet, Users, Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'
import axios from 'axios'

const StudentDatabase = () => {
    const { students, studentRecords, backendUrl, fetchBackendData } = useContext(AppContext)

    const [search, setSearch] = useState('')
    const [branchFilter, setBranchFilter] = useState('All')
    const [statusFilter, setStatusFilter] = useState('All')

    const [activeTab, setActiveTab] = useState('registered')
    const fileInputRef = useRef(null)

    const handleToggleBlacklist = async (id) => {
        try {
            const res = await axios.put(`${backendUrl}/api/admin/students/${id}/blacklist`)
            fetchBackendData()
            if (res.data.isBlacklisted) toast.error("Student has been blacklisted.")
            else toast.success("Student blacklist lifted.")
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleClearLedger = async () => {
        if (!window.confirm("Are you ABSOLUTELY sure you want to clear the entire Master Ledger? This action cannot be undone.")) return;
        try {
            await axios.delete(`${backendUrl}/api/admin/student-records/clear`)
            fetchBackendData()
            toast.success("Master ledger has been completely cleared.")
        } catch (error) { toast.error("Failed to clear ledger.") }
    }

    const handleDeleteLedgerRecord = async (id) => {
        if (!window.confirm("Delete this student record from the ledger?")) return;
        try {
            await axios.delete(`${backendUrl}/api/admin/student-records/${id}`)
            fetchBackendData()
            toast.success("Record deleted successfully.")
        } catch (error) { toast.error("Failed to delete record.") }
    }

    // ✅ REGISTERED FILTER (UNCHANGED)
    const filteredStudents = students.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNumber.includes(search)
        const matchesBranch = branchFilter === 'All' || s.branch === branchFilter
        const matchesStatus = statusFilter === 'All' || 
            (statusFilter === 'Active' && !s.isBlacklisted) || 
            (statusFilter === 'Blacklisted' && s.isBlacklisted)
        
        return matchesSearch && matchesBranch && matchesStatus
    })

    // ✅ BRANCHES (UNCHANGED)
    const branches = activeTab === 'registered' 
        ? ['All', ...new Set(students.map(s => s.branch))] 
        : ['All', ...new Set(studentRecords.map(s => s.branch))]

    // ✅ CSV UPLOAD (UNCHANGED)
    const handleFileUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        try {
            const text = await file.text()
            const rows = text.split('\n').map(r => r.trim()).filter(r => r.length > 0)
            if (rows.length < 2) return toast.error("File is empty or missing headers")

            const parseCsvRow = (row) => {
                const cols = [];
                let current = '';
                let inQuotes = false;
                for (let i = 0; i < row.length; i++) {
                    if (row[i] === '"') {
                        inQuotes = !inQuotes;
                    } else if (row[i] === ',' && !inQuotes) {
                        cols.push(current.trim().replace(/^"|"$/g, ''));
                        current = '';
                    } else {
                        current += row[i];
                    }
                }
                cols.push(current.trim().replace(/^"|"$/g, ''));
                return cols;
            };

            const headers = parseCsvRow(rows[0]).map(h => h.toLowerCase())
            
            const rollIdx = headers.findIndex(h => h.includes('roll'))
            const nameIdx = headers.findIndex(h => h.includes('name'))
            const emailIdx = headers.findIndex(h => h.includes('email'))
            const branchIdx = headers.findIndex(h => h.includes('branch'))
            const degreeIdx = headers.findIndex(h => h.includes('degree'))
            const yearIdx = headers.findIndex(h => h.includes('year'))

            if (rollIdx === -1 || nameIdx === -1 || branchIdx === -1) {
                return toast.error("CSV Headers missing. Required: Roll, Name, Branch.")
            }

            const records = rows.slice(1).map(row => {
                const cols = parseCsvRow(row);
                let rRoll = cols[rollIdx] ? cols[rollIdx].trim() : '';
                let rName = cols[nameIdx] ? cols[nameIdx].trim() : '';

                if (!rRoll && rName) {
                    const match = rName.match(/^(\d+|\d\.\d+E\+\d+)\s+(.+)$/i);
                    if (match) {
                        rRoll = match[1];
                        rName = match[2];
                    }
                }

                return {
                    rollNumber: rRoll,
                    name: rName,
                    email: emailIdx !== -1 ? cols[emailIdx] : '',
                    branch: cols[branchIdx] || '',
                    degree: (degreeIdx !== -1 && cols[degreeIdx]) ? cols[degreeIdx] : 'B.Tech',
                    year: (yearIdx !== -1 && cols[yearIdx]) ? cols[yearIdx] : '2025'
                }
            }).filter(r => r.rollNumber && r.name && r.branch)

            if (records.length === 0) {
                return toast.error("No valid records found in the CSV.")
            }

            await axios.post(`${backendUrl}/api/admin/student-records/bulk`, { records })
            toast.success(`Successfully processed ${records.length} valid records!`)
            fetchBackendData()
        } catch (err) {
            toast.error("Failed to upload CSV")
        }

        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className='container mx-auto p-2 sm:p-4'
        >
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6 gap-6">
                <button 
                    onClick={() => setActiveTab('registered')}
                    className={`flex items-center gap-2 pb-3 font-semibold transition-colors ${activeTab === 'registered' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <Users size={18} /> Registered Accounts
                </button>
                <button 
                    onClick={() => setActiveTab('ledger')}
                    className={`flex items-center gap-2 pb-3 font-semibold transition-colors ${activeTab === 'ledger' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <FileSpreadsheet size={18} /> Master Ledger
                </button>
            </div>

            {/* Header */}
            <div className='glass-panel p-6 rounded-3xl mb-8 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 shadow-sm border border-gray-100'>
                <div>
                    <h2 className='text-2xl font-bold text-gray-800 tracking-tight'>
                        {activeTab === 'registered' && 'Student Directory'}
                        {activeTab === 'ledger' && 'Official Batch Ledger'}
                    </h2>
                    <p className='text-gray-500 text-sm mt-1'>
                        {activeTab === 'registered' && 'Manage registered candidates and enforce strict disciplinary actions.'}
                        {activeTab === 'ledger' && 'Upload official CSVs and track the entire enrolled branch.'}
                    </p>
                </div>
                
                <div className='flex flex-wrap items-center gap-3 w-full xl:w-auto'>
                    {/* Search */}
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

                    {/* Branch Filter */}
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
                                <option key={b} value={b}>{b === 'All' ? 'All Branches' : b}</option>
                            ))}
                        </select>
                    </div>

                    {/* Status Filter */}
                    {activeTab === 'registered' && (
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="glass-input px-4 py-2.5 text-sm font-medium min-w-[130px]"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Active">🟢 Active Only</option>
                            <option value="Blacklisted">🔴 Blacklisted</option>
                        </select>
                    )}

                    {/* Ledger Actions */}
                    {activeTab === 'ledger' && (
                        <div className="relative flex gap-2">
                            <button 
                                onClick={handleClearLedger}
                                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl shadow-sm font-semibold text-sm text-red-600 hover:bg-red-50 border border-gray-200 bg-white"
                            >
                                <Trash2 size={16} /> Clear
                            </button>
                            <input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="btn-primary flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl shadow-md"
                            >
                                <Upload size={16} /> Import CSV
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className='glass-panel rounded-3xl overflow-hidden border border-gray-100 bg-white/50 shadow-sm'>
                <div className='overflow-x-auto'>
                    <table className='w-full text-sm text-left whitespace-nowrap'>
                        <thead className='bg-gray-50/80 border-b border-gray-100 text-gray-600 font-bold uppercase tracking-wider text-xs'>
                            <tr>
                                <th className='py-4 px-6'>Roll Number</th>
                                <th className='py-4 px-6'>Full Name</th>
                                <th className='py-4 px-6'>{activeTab === 'ledger' ? 'Course Details' : 'Branch'}</th>
                                {activeTab === 'registered' && <th className='py-4 px-6 text-center'>Account Status</th>}
                                <th className='py-4 px-6 text-center'>{activeTab === 'ledger' ? 'Verification & Actions' : 'Quick Action'}</th>
                            </tr>
                        </thead>

                        <tbody className='divide-y divide-gray-100'>
                            {/* REGISTERED */}
                            {activeTab === 'registered' && filteredStudents.map((student, index) => (
                                <tr key={index} className={`transition-colors ${student.isBlacklisted ? 'bg-red-50/30 hover:bg-red-50/50' : 'hover:bg-blue-50/20'}`}>
                                    <td className='py-3 px-6 font-semibold text-gray-600'>{student.rollNumber}</td>
                                    <td className='py-3 px-6 font-bold'>{student.name}</td>
                                    <td className='py-3 px-6'>{student.branch}</td>
                                    <td className='py-3 px-6 text-center'>
                                        {student.isBlacklisted ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                                                <ShieldAlert size={12}/> BANNED
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700">
                                                <UserCheck size={12}/> ACTIVE
                                            </span>
                                        )}
                                    </td>
                                    <td className='py-3 px-6 text-center'>
                                        <button onClick={() => handleToggleBlacklist(student._id)}>
                                            {student.isBlacklisted ? <UserCheck size={14}/> : <UserX size={14}/>}
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {/* LEDGER */}
                            {activeTab === 'ledger' && studentRecords
                                .filter(s =>
                                    (s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNumber.includes(search)) &&
                                    (branchFilter === 'All' || s.branch === branchFilter)
                                )
                                .map((record, index) => {
                                    const isRegistered = students.some(rs => rs.rollNumber === record.rollNumber);
                                    return (
                                        <tr key={index} className='hover:bg-blue-50/20'>
                                            <td className='py-3 px-6 font-semibold text-gray-600'>{record.rollNumber}</td>
                                            <td className='py-3 px-6 font-bold'>{record.name}</td>
                                            <td className='py-3 px-6'>{record.degree} - {record.branch}</td>
                                            <td className='py-3 px-6 text-center flex justify-center gap-3'>
                                                {isRegistered ? 'Registered' : 'Unregistered'}
                                                <button onClick={() => handleDeleteLedgerRecord(record._id)}>
                                                    <Trash2 size={14}/>
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    )
}

export default StudentDatabase
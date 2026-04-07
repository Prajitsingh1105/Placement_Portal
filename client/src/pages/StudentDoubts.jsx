import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'
import { Send, MessageSquareText, CheckCircle2, CircleDashed } from 'lucide-react'
import { toast } from 'react-toastify'
import Navbar from '../components/Navbar'
import { useAuth } from '@clerk/react'
import axios from 'axios'

const StudentDoubts = () => {
    const { backendUrl } = useContext(AppContext)
    const { getToken, isLoaded } = useAuth()
    const [myQueries, setMyQueries] = useState([])
    const [newQuery, setNewQuery] = useState('')

    const syncProfileAndFetchDoubts = async () => {
        try {
            const token = await getToken();
            if (!token) return;

            // Optional: Call profile endpoint to auto-sync the Clerk user to MongoDB Student Collection
            await axios.get(`${backendUrl}/api/student/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            })

            // Fetch Student's specific queries
            const res = await axios.get(`${backendUrl}/api/student/doubts`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setMyQueries(res.data.queries || [])
        } catch (error) {
            console.error("Student Doubts Error:", error)
        }
    }

    useEffect(() => {
        if (isLoaded) {
            syncProfileAndFetchDoubts()
        }
    }, [isLoaded])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!newQuery.trim()) return;

        try {
            const token = await getToken()
            await axios.post(`${backendUrl}/api/student/doubts`, { query: newQuery }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setNewQuery('')
            toast.success("Query submitted to placement cell.")
            await syncProfileAndFetchDoubts()
        } catch (error) { toast.error(error.message) }
    }

    return (
        <div className="bg-slate-50 min-h-screen">
            <Navbar />
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className='container mx-auto p-4 sm:p-8 max-w-4xl'
            >
                <div className='mb-8'>
                    <h2 className='text-3xl font-extrabold text-gray-800 tracking-tight'>Doubt Resolution Forum</h2>
                    <p className='text-gray-500 mt-1 font-medium'>Ask the placement coordinators any question regarding drives, eligibility, or offers.</p>
                </div>

                <div className="glass-panel p-6 rounded-3xl mb-8 shadow-sm border border-gray-100">
                    <form onSubmit={handleSubmit} className="relative">
                        <textarea 
                            className="glass-input w-full p-4 pr-16 h-32 resize-none text-gray-700" 
                            placeholder="Type your question here... e.g., Are ECE students eligible for the upcoming Amazon drive?"
                            value={newQuery}
                            onChange={(e) => setNewQuery(e.target.value)}
                        />
                        <button 
                            type="submit" 
                            className="absolute bottom-4 right-4 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl transition-all shadow-md flex items-center justify-center disabled:opacity-50"
                            disabled={!newQuery.trim()}
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2 mb-4">
                        <MessageSquareText size={20} className="text-gray-400" /> My Past Queries
                    </h3>

                    {myQueries.map(q => (
                        <div key={q._id} className="glass-panel p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
                            <div className="flex items-start justify-between">
                                <p className="font-semibold text-gray-800 text-lg mr-8 leading-snug">{q.query}</p>
                                <span className={`shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                                    ${q.isResolved ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-orange-50 text-orange-600 border border-orange-200'}`}>
                                    {q.isResolved ? <CheckCircle2 size={14} /> : <CircleDashed size={14} className="animate-spin-slow" />}
                                    {q.isResolved ? 'Resolved' : 'Pending'}
                                </span>
                            </div>
                            
                            {q.reply && (
                                <div className="bg-indigo-50/50 border border-indigo-100/50 rounded-xl p-4 mt-2">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">PC</div>
                                        <span className="text-sm font-bold text-indigo-900">Coordinator Reply</span>
                                    </div>
                                    <p className="text-gray-700 text-sm font-medium">{q.reply}</p>
                                </div>
                            )}
                        </div>
                    ))}

                    {myQueries.length === 0 && (
                        <div className="text-center py-12 bg-white/50 rounded-3xl border border-dashed border-gray-200">
                            <p className="text-gray-500 font-medium">You haven't asked any questions yet.</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    )
}

export default StudentDoubts

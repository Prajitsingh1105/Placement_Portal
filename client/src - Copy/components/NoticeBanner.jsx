import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'
import { Megaphone, AlertCircle } from 'lucide-react'

const NoticeBanner = () => {
    const { notices } = useContext(AppContext)

    if (!notices || notices.length === 0) return null;

    return (
        <div className="w-full bg-slate-900 border-b border-indigo-500/30 overflow-hidden py-2 relative flex items-center shadow-inner z-40">
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-900 to-transparent z-10 flex items-center justify-center pl-4 border-r border-white/10">
                <span className="flex items-center gap-1.5 text-xs font-black uppercase text-indigo-400 tracking-wider">
                    <Megaphone size={14} className="text-indigo-400 animate-pulse" />
                    Updates
                </span>
            </div>
            
            <div className="relative w-full flex align-middle items-center overflow-hidden h-6 ml-24">
                <motion.div
                    className="flex whitespace-nowrap min-w-full space-x-12 px-6"
                    animate={{
                        x: [0, -1000],
                    }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: 'loop',
                            duration: notices.length * 10,
                            ease: 'linear',
                        },
                    }}
                >
                    {[...notices, ...notices, ...notices].map((notice, index) => (
                        <div key={`${notice._id}-${index}`} className="flex items-center gap-3">
                            <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${notice.urgency === 'Urgent' ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-blue-500/20 text-blue-400 border border-blue-500/50'}`}>
                                {notice.urgency === 'Urgent' ? <AlertCircle size={10} className="mr-1" /> : null}
                                {notice.urgency}
                            </span>
                            <span className="text-sm font-semibold text-white">{notice.title}:</span>
                            <span className="text-sm text-gray-300">{notice.content}</span>
                        </div>
                    ))}
                </motion.div>
            </div>
            
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-900 to-transparent z-10"></div>
        </div>
    )
}

export default NoticeBanner

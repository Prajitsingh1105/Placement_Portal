import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, Briefcase, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const data = [
  { name: 'Mon', applications: 4 },
  { name: 'Tue', applications: 7 },
  { name: 'Wed', applications: 2 },
  { name: 'Thu', applications: 12 },
  { name: 'Fri', applications: 9 },
  { name: 'Sat', applications: 15 },
  { name: 'Sun', applications: 20 },
];

const statsData = [
  { title: "Total Jobs", value: "24", trend: "+3", icon: <Briefcase className="text-blue-500" />, bg: "bg-blue-50", trendUp: true },
  { title: "Total Applicants", value: "156", trend: "+24%", icon: <Users className="text-indigo-500" />, bg: "bg-indigo-50", trendUp: true },
  { title: "Pending Reviews", value: "48", trend: "-5", icon: <Clock className="text-yellow-500" />, bg: "bg-yellow-50", trendUp: false },
  { title: "Hired Students", value: "12", trend: "+2", icon: <CheckCircle className="text-green-500" />, bg: "bg-green-50", trendUp: true },
];

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
}

const DashboardHome = () => {
  return (
    <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="p-4 md:p-8 space-y-8"
    >
      <div>
        <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Overview</h2>
        <p className="text-gray-500">Welcome back, here's what's happening today.</p>
      </div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, idx) => (
          <motion.div variants={itemVariants} key={idx} className="glass-panel p-6 rounded-2xl flex flex-col gap-4 shadow-sm border border-gray-100 min-w-0">
            <div className="flex items-center justify-between">
                <div className={`p-4 rounded-full ${stat.bg}`}>
                {stat.icon}
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${stat.trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {stat.trendUp && <TrendingUp size={12} />} {stat.trend}
                </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</h3>
              <p className="text-sm font-medium text-gray-500 truncate">{stat.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 border-t border-gray-100 pt-8">
        
        {/* Weekly Applications Chart */}
        <motion.div variants={itemVariants} className="glass-panel p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className='absolute top-0 right-0 w-48 h-48 bg-blue-50/50 rounded-full blur-3xl -mt-10 -mr-10'></div>
          <div className="relative z-10">
              <h3 className="text-lg font-bold text-gray-800 mb-1">Applications This Week</h3>
              <p className="text-sm text-gray-500 mb-6">Daily breakdown of student applications</p>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dx={-10} />
                    <Tooltip 
                        cursor={{fill: '#f8fafc'}}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="applications" fill="url(#colorUv)" radius={[6, 6, 0, 0]} barSize={32} />
                    <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#818cf8" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#6366f1" stopOpacity={1}/>
                        </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
          </div>
        </motion.div>

        {/* Growth Trend */}
        <motion.div variants={itemVariants} className="glass-panel p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className='absolute bottom-0 left-0 w-48 h-48 bg-indigo-50/50 rounded-full blur-3xl -mb-10 -ml-10'></div>
          <div className="relative z-10">
              <h3 className="text-lg font-bold text-gray-800 mb-1">Application Trends</h3>
              <p className="text-sm text-gray-500 mb-6">Overview of platform engagement</p>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dx={-10} />
                    <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="applications" 
                        stroke="#4f46e5" 
                        strokeWidth={4} 
                        dot={{r: 4, strokeWidth: 2, fill: '#fff'}} 
                        activeDot={{r: 6, fill: '#4f46e5', strokeWidth: 0}} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default DashboardHome;

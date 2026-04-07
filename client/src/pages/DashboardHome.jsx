import React, { useContext, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Briefcase, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

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
  const { jobs, applications, offerLetters } = useContext(AppContext)
  
  const pendingApps = applications ? applications.filter(a => !a.status || a.status === 'Pending').length : 0;
  
  const statsData = [
    { title: "Total Jobs", value: jobs ? jobs.length : 0, trend: "+New", icon: <Briefcase className="text-blue-500" />, bg: "bg-blue-50", trendUp: true },
    { title: "Total Applicants", value: applications ? applications.length : 0, trend: "Active", icon: <Users className="text-indigo-500" />, bg: "bg-indigo-50", trendUp: true },
    { title: "Pending Reviews", value: pendingApps, trend: "Action", icon: <Clock className="text-yellow-500" />, bg: "bg-yellow-50", trendUp: false },
    { title: "Verified Placements", value: offerLetters ? offerLetters.length : 0, trend: "+Placed", icon: <CheckCircle className="text-green-500" />, bg: "bg-green-50", trendUp: true },
  ];

  // Graph 1: Placements by Branch
  const branchData = useMemo(() => {
    if (!offerLetters) return [];
    const counts = {};
    offerLetters.forEach(record => {
      const branch = record.branch || 'Other';
      counts[branch] = (counts[branch] || 0) + 1;
    });
    return Object.keys(counts).map(branch => ({ name: branch, count: counts[branch] }));
  }, [offerLetters]);

  // Graph 2: Jobs by Category
  const categoryData = useMemo(() => {
    if (!jobs) return [];
    const counts = {};
    jobs.forEach(job => {
      const category = job.category || 'Other';
      counts[category] = (counts[category] || 0) + 1;
    });
    return Object.keys(counts).map(category => ({ name: category, value: counts[category] }));
  }, [jobs]);

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#3b82f6'];

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
        
        {/* Placements by Branch */}
        <motion.div variants={itemVariants} className="glass-panel p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className='absolute top-0 right-0 w-48 h-48 bg-blue-50/50 rounded-full blur-3xl -mt-10 -mr-10'></div>
          <div className="relative z-10">
              <h3 className="text-lg font-bold text-gray-800 mb-1">Placements by Branch</h3>
              <p className="text-sm text-gray-500 mb-6">Breakdown of verified offer letters</p>
              <div className="h-72 w-full">
                {branchData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={branchData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dx={-10} allowDecimals={false} />
                        <Tooltip 
                            cursor={{fill: '#f8fafc'}}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="count" fill="url(#colorUv)" radius={[6, 6, 0, 0]} barSize={32} />
                        <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#818cf8" stopOpacity={1}/>
                            <stop offset="100%" stopColor="#6366f1" stopOpacity={1}/>
                            </linearGradient>
                        </defs>
                    </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 font-medium">No placement records available</div>
                )}
              </div>
          </div>
        </motion.div>

        {/* Jobs by Category Trend */}
        <motion.div variants={itemVariants} className="glass-panel p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className='absolute bottom-0 left-0 w-48 h-48 bg-indigo-50/50 rounded-full blur-3xl -mb-10 -ml-10'></div>
          <div className="relative z-10">
              <h3 className="text-lg font-bold text-gray-800 mb-1">Job Market Demands</h3>
              <p className="text-sm text-gray-500 mb-6">Distribution of active job postings</p>
              <div className="h-72 w-full">
                {categoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        >
                        {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                    </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 font-medium">No active jobs available</div>
                )}
              </div>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default DashboardHome;

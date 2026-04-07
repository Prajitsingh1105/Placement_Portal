import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { User, BookOpen, GraduationCap, Calendar, Phone, Hash } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentProfile = () => {
  const [formData, setFormData] = useState({
    rollNumber: '',
    degree: 'B.Tech',
    branch: 'Computer Science and Engineering',
    passingYear: '2026',
    phone: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Later: Send to backend
    toast.success("Profile updated successfully!");
    console.log("Profile Data:", formData);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <ToastContainer position="bottom-right" />
      <div className="flex-grow flex items-center justify-center p-6 mt-16">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-panel max-w-2xl w-full p-8 rounded-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
              <User size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Complete Profile</h1>
              <p className="text-gray-500 mt-1">Provide your details to stand out to recruiters.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Roll Number */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Hash size={16} className="text-gray-400" />
                  Roll Number
                </label>
                <input 
                  type="text" 
                  name="rollNumber"
                  required
                  value={formData.rollNumber}
                  onChange={handleChange}
                  placeholder="e.g. 230052010001" 
                  className="glass-input"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Phone size={16} className="text-gray-400" />
                  Phone Number
                </label>
                <input 
                  type="tel" 
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 9876543210" 
                  className="glass-input"
                />
              </div>

              {/* Degree */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <GraduationCap size={16} className="text-gray-400" />
                  Degree
                </label>
                <select name="degree" value={formData.degree} onChange={handleChange} className="glass-input appearance-none bg-white/70">
                  <option>B.Tech</option>
                  <option>MBA</option>
                  <option>MCA</option>
                  <option>M.Tech</option>
                </select>
              </div>

              {/* Branch */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <BookOpen size={16} className="text-gray-400" />
                  Branch
                </label>
                <select name="branch" value={formData.branch} onChange={handleChange} className="glass-input appearance-none bg-white/70">
                  <option>Computer Science and Engineering</option>
                  <option>Information Technology</option>
                  <option>Electronics and Communication</option>
                  <option>Electrical Engineering</option>
                  <option>Mechanical Engineering</option>
                  <option>Civil Engineering</option>
                  <option>Chemical Engineering</option>
                </select>
              </div>

              {/* Graduation Year */}
              <div className="space-y-2 md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Calendar size={16} className="text-gray-400" />
                  Year of Passing
                </label>
                <select name="passingYear" value={formData.passingYear} onChange={handleChange} className="glass-input appearance-none bg-white/70 w-1/2">
                  <option>2024</option>
                  <option>2025</option>
                  <option>2026</option>
                  <option>2027</option>
                  <option>2028</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button type="submit" className="btn-primary w-full md:w-auto flex items-center justify-center gap-2">
                Save Profile
              </button>
            </div>
          </form>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default StudentProfile;

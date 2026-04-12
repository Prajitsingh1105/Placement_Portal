import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ApplyJob from './pages/ApplyJob'
import Applications from './pages/Applications'
import StudentProfile from './pages/StudentProfile'
import RecruiterLogin from './components/RecruiterLogin'
import { AppContext } from './context/AppContext'
import { useContext } from 'react'
import Dashboard from './pages/Dashboard'
import AddJob from './pages/AddJob'
import ManageJobs from './pages/ManageJobs'
import ViewApplications from './pages/ViewApplications'
import DashboardHome from './pages/DashboardHome'
import ManageNotices from './pages/ManageNotices'
import CompanyTracker from './pages/CompanyTracker'
import PlacementRecords from './pages/PlacementRecords'
import StudentDatabase from './pages/StudentDatabase'
import ManageQueries from './pages/ManageQueries'
import StudentDoubts from './pages/StudentDoubts'
import PlacementDetails from './pages/PlacementDetails'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import 'quill/dist/quill.snow.css'

const App = () => {
  const { showRecruiterLogin } = useContext(AppContext)

  return (
    <div>
      <ToastContainer position="bottom-right" />
      {showRecruiterLogin && <RecruiterLogin />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apply-job/:id" element={<ApplyJob />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/profile" element={<StudentProfile />} />
        <Route path="/doubts" element={<StudentDoubts />} />
        <Route path="/placement-details" element={<PlacementDetails />} />

        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="add-job" element={<AddJob />} />
          <Route path="manage-jobs" element={<ManageJobs />} />
          <Route path="view-applications" element={<ViewApplications />} />
          <Route path="manage-notices" element={<ManageNotices />} />
          <Route path="company-tracker" element={<CompanyTracker />} />
          <Route path="placement-records" element={<PlacementRecords />} />
          <Route path="student-database" element={<StudentDatabase />} />
          <Route path="manage-queries" element={<ManageQueries />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
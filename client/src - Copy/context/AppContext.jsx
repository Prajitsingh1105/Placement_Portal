import { createContext,useEffect,useState} from "react";
import {jobsData, initialNotices, initialCompanies, initialOfferLetters, initialStudents, initialQueries} from '../assets/assets'
export const AppContext= createContext()

export const AppContextProvider=(props)=>{
    const [searchFilter, setSearchFilter] = useState({
        title: '',
        location: ''
    })
    
     const [isSearched, setIsSearched] = useState(false)
     const [jobs, setJobs] = useState([])
     const [showRecruiterLogin, setShowRecruiterLogin] = useState(false)
     
     const [companyToken, setCompanyToken] = useState(null)
     const [companyData, setCompanyData] = useState(null)

     // Feature States
     const [notices, setNotices] = useState([])
     const [companies, setCompanies] = useState([])
     const [offerLetters, setOfferLetters] = useState([])
     const [students, setStudents] = useState([])
     const [queries, setQueries] = useState([])

     // Function to Fetch Jobs and Initial Data
    const fetchJobs = async () => {
        setJobs(jobsData)
        setNotices(initialNotices)
        setCompanies(initialCompanies)
        setOfferLetters(initialOfferLetters)
        setStudents(initialStudents)
        setQueries(initialQueries)
    }

    // Retrive Company Token From LocalStorage
    useEffect(() => {
        fetchJobs()

    }, [])

    const value={
        setSearchFilter, searchFilter,
        isSearched, setIsSearched,
        jobs, setJobs,
        showRecruiterLogin, setShowRecruiterLogin,
        companyToken, setCompanyToken,
        companyData, setCompanyData,
        notices, setNotices,
        companies, setCompanies,
        offerLetters, setOfferLetters,
        students, setStudents,
        queries, setQueries
    }

    return <AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>
}
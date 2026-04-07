import { useContext, useEffect, useRef, useState } from 'react'
import Quill from 'quill'
import { JobCategories, JobLocations } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import { motion } from 'framer-motion'
import { PlusCircle } from 'lucide-react'

const AddJob = () => {

    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('Bangalore');
    const [category, setCategory] = useState('Programming');
    const [level, setLevel] = useState('Beginner level');
    const [salary, setSalary] = useState(0);

    const editorRef = useRef(null)
    const quillRef = useRef(null)

    // const { backendUrl, companyToken } = useContext(AppContext)

    const onSubmitHandler = async (e) => {
        e.preventDefault()
    }


    useEffect(() => {
        // Initiate Qill only once
        if (!quillRef.current && editorRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow',
            })
        }
    }, [])

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className='container p-4 md:p-8 max-w-4xl'
        >
            <div className='glass-panel p-8 rounded-3xl shadow-sm border border-gray-100'>
                <div className='mb-8'>
                    <h2 className='text-3xl font-extrabold text-gray-800 tracking-tight'>Post a New Job</h2>
                    <p className='text-gray-500 mt-2'>Fill in the details below to broadcast an opening to the student portal.</p>
                </div>

                <form onSubmit={onSubmitHandler} className='flex flex-col items-start gap-6'>

                    <div className='w-full'>
                        <label className='block text-sm font-semibold text-gray-700 mb-2'>Job Title</label>
                        <input type="text" placeholder='e.g. Senior Full Stack Developer'
                            onChange={e => setTitle(e.target.value)} value={title}
                            required
                            className='glass-input w-full max-w-2xl px-4 py-3'
                        />
                    </div>

                    <div className='w-full'>
                        <label className='block text-sm font-semibold text-gray-700 mb-2'>Job Description</label>
                        <div className="rounded-xl overflow-hidden border border-gray-200">
                            <div ref={editorRef} className='min-h-[200px] bg-white text-gray-800'></div>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl'>

                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-2'>Job Category</label>
                            <select className='glass-input w-full px-4 py-3' onChange={e => setCategory(e.target.value)}>
                                {JobCategories.map((category, index) => (
                                    <option key={index} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-2'>Job Location</label>
                            <select className='glass-input w-full px-4 py-3' onChange={e => setLocation(e.target.value)}>
                                {JobLocations.map((location, index) => (
                                    <option key={index} value={location}>{location}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-2'>Job Level</label>
                            <select className='glass-input w-full px-4 py-3' onChange={e => setLevel(e.target.value)}>
                                <option value="Beginner level">Beginner level</option>
                                <option value="Intermediate level">Intermediate level</option>
                                <option value="Senior level">Senior level</option>
                            </select>
                        </div>

                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-2'>Job Salary (CTC)</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 font-medium">₹</span>
                                <input min={0} className='glass-input w-full pl-8 px-4 py-3' onChange={e => setSalary(e.target.value)} type="Number" placeholder='e.g. 1500000' />
                            </div>
                        </div>

                    </div>

                    <div className="pt-6 w-full border-t border-gray-100 mt-2">
                        <button className='btn-primary px-8 py-3.5 flex items-center gap-2 shadow-lg hover:shadow-indigo-500/25'>
                            <PlusCircle size={20} /> Post Job Opening
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    )
}

export default AddJob
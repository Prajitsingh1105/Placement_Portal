import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    level: { type: String, required: true },
    salary: { type: Number, required: true },
    date: { type: Number, required: true },
    company: { type: String, default: 'General Company' },
    logo: { type: String, default: '' },
    visible: { type: Boolean, default: true }
});

const Job = mongoose.model('Job', fileSchema);
export default Job;

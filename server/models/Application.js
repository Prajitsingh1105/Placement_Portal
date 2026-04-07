import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    rollNumber: { type: String, default: "N/A" },
    branch: { type: String, default: "N/A" },
    year: { type: String, default: "N/A" },
    company: { type: String, default: "Unknown Company" },
    jobTitle: { type: String, required: true },
    location: { type: String, default: "Remote" },
    imgSrc: { type: String, default: "" },
    resume: { type: String, default: "#" },
    status: { type: String, default: "Pending", enum: ["Pending", "Accepted", "Rejected"] },
    date: { type: Number, required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' }
});

const Application = mongoose.model('Application', applicationSchema);
export default Application;

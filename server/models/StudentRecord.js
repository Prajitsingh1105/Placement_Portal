import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    rollNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, default: "" },
    branch: { type: String, required: true },
    degree: { type: String, required: true },
    year: { type: String, required: true }
});

const StudentRecord = mongoose.model('StudentRecord', fileSchema);
export default StudentRecord;

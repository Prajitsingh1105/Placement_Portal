import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    query: { type: String, required: true },
    isResolved: { type: Boolean, default: false },
    reply: { type: String, default: "" }
}, { timestamps: true });

const ForumQuery = mongoose.model('ForumQuery', fileSchema);
export default ForumQuery;

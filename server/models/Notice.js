import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, default: "" },
    urgency: { type: String, default: "General", enum: ["General", "Urgent"] },
    date: { type: Number, required: true }
});

const Notice = mongoose.model('Notice', fileSchema);
export default Notice;

import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sector: { type: String, required: true },
    logo: { type: String, default: "" },
    tag: { type: String, default: "In Discussion" }
});

const Company = mongoose.model('Company', fileSchema);
export default Company;

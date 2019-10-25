import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
});



const Doctor = mongoose.model("Doctor", doctorSchema);

export { Doctor };

import mongoose from "mongoose";

const birthdaySchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  email: { type: String, required: true },
  reminder: { type: Boolean, default: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Birthday = mongoose.model("Birthday", birthdaySchema);
export default Birthday;
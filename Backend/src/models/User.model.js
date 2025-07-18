import mongoose from "mongoose";
import bycrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bycrypt.hash(this.password, 10);
});

export default mongoose.model("User", userSchema);

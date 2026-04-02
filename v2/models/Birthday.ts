import mongoose, { Document, Model } from "mongoose";

export interface IBirthday extends Document {
  name: string;
  dob: Date;
  email: string;
  reminder: boolean;
  user: mongoose.Types.ObjectId;
}

const birthdaySchema = new mongoose.Schema<IBirthday>({
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  email: { type: String, required: true },
  reminder: { type: Boolean, default: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Birthday: Model<IBirthday> =
  mongoose.models.Birthday ||
  mongoose.model<IBirthday>("Birthday", birthdaySchema);

export default Birthday;

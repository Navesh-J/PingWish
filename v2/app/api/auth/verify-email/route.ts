import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token)
    return NextResponse.json({ message: "Missing token" }, { status: 400 });

  await connectDB();

  const user = await User.findOne({
    verifyToken: token,
    verifyTokenExpiry: { $gt: new Date() },
  });

  if (!user) {
    return NextResponse.json(
      { message: "Verification link is invalid or has expired." },
      { status: 400 }
    );
  }

  user.isVerified = true;
  await user.save();

  await User.updateOne(
    { _id: user._id },
    { $unset: { verifyToken: "", verifyTokenExpiry: "" } }
  );

  return NextResponse.json({ message: "Email verified successfully!" });
}   
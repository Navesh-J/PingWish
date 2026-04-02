import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password)
      return NextResponse.json({ message: "All fields required" }, { status: 400 });

    if (password.length < 8)
      return NextResponse.json(
        { message: "Password must be at least 8 characters" },
        { status: 400 }
      );

    await connectDB();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing)
      return NextResponse.json({ message: "Email already in use" }, { status: 400 });

    await User.create({ name, email, password });

    return NextResponse.json({ message: "Account created" }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Birthday from "@/models/Birthday";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  await connectDB();
  const birthdays = await Birthday.find({ user: session.user.id }).sort({ dob: 1 });
  return NextResponse.json(birthdays);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { name, dob, email } = await req.json();
    if (!name || !dob || !email)
      return NextResponse.json({ message: "All fields required" }, { status: 400 });

    await connectDB();
    const entry = await Birthday.create({ name, dob, email, user: session.user.id });
    return NextResponse.json(entry, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

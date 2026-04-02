import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Birthday from "@/models/Birthday";

export async function PUT(_req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  await connectDB();
  const birthday = await Birthday.findOne({ _id: params.id, user: session.user.id });
  if (!birthday)
    return NextResponse.json({ message: "Not found" }, { status: 404 });

  birthday.reminder = !birthday.reminder;
  await birthday.save();
  return NextResponse.json({ reminder: birthday.reminder });
}

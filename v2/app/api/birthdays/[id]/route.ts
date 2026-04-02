import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Birthday from "@/models/Birthday";

interface Params {
  params: { id: string };
}

export async function PUT(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  await connectDB();
  const birthday = await Birthday.findOne({ _id: params.id, user: session.user.id });
  if (!birthday)
    return NextResponse.json({ message: "Not found" }, { status: 404 });

  const body = await req.json();
  Object.assign(birthday, body);
  await birthday.save();
  return NextResponse.json(birthday);
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  await connectDB();
  const birthday = await Birthday.findOneAndDelete({
    _id: params.id,
    user: session.user.id,
  });
  if (!birthday)
    return NextResponse.json({ message: "Not found" }, { status: 404 });

  return NextResponse.json({ message: "Deleted" });
}

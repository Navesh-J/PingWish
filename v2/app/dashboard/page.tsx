import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Birthday from "@/models/Birthday";
import DashboardClient from "@/components/DashboardClient";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  await connectDB();
  const raw = await Birthday.find({ user: session.user.id })
    .sort({ dob: 1 })
    .lean();

  // Serialize for client
  const birthdays = raw.map((b) => ({
    _id: b._id.toString(),
    name: b.name,
    dob: b.dob.toISOString(),
    email: b.email,
    reminder: b.reminder,
  }));

  return (
    <DashboardClient
      initialBirthdays={birthdays}
      userName={session.user.name ?? ""}
    />
  );
}

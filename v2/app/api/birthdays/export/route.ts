import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Birthday from "@/models/Birthday";

function getAge(dob: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  if (
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
  )
    age--;
  return age;
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format") || "csv"; // csv | excel

  await connectDB();

  const birthdays = await Birthday.find({ user: session.user.id }).sort({ dob: 1 });

  const rows = birthdays.map((b) => ({
    Name: b.name,
    "Date of Birth": new Date(b.dob).toISOString().slice(0, 10),
    Email: b.email,
    "Reminder": b.reminder ? "true" : "false",
  }));

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Column widths
  worksheet["!cols"] = [
    { wch: 25 }, // Name
    { wch: 16 }, // DOB
    { wch: 30 }, // Email
    { wch: 10 }, // Reminder
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, "Birthdays");

  if (format === "excel") {
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="pingwish-birthdays.xlsx"`,
      },
    });
  }

  // Default: CSV
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="pingwish-birthdays.csv"`,
    },
  });
}
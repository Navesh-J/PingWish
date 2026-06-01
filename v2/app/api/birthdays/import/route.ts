import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Birthday from "@/models/Birthday";

interface RawRow {
  Name?: string;
  name?: string;
  "Date of Birth"?: string | Date;
  "date of birth"?: string | Date;
  DOB?: string | Date;
  dob?: string | Date;
  Email?: string;
  email?: string;
  Reminder?: string;
  reminder?: string;
}

function parseRow(row: RawRow) {
  const name = row.Name || row.name || "";
  const dobRaw =
    row["Date of Birth"] ||
    row["date of birth"] ||
    row.DOB ||
    row.dob ||
    "";

  const email = row.Email || row.email || "";
  const reminderRaw = row.Reminder ?? row.reminder ?? "true";
  const reminder = String(reminderRaw).toLowerCase() !== "false";

  return {
    name: String(name).trim(),
    dobRaw,
    email: String(email).trim(),
    reminder,
  };
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }

    const fileName = file.name.toLowerCase();
    const isCSV = fileName.endsWith(".csv");
    const isExcel =
      fileName.endsWith(".xlsx") || fileName.endsWith(".xls");

    if (!isCSV && !isExcel) {
      return NextResponse.json(
        {
          message:
            "Only CSV or Excel (.xlsx/.xls) files are supported",
        },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const workbook = XLSX.read(buffer, {
      type: "buffer",
      cellDates: true,
    });

    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const rows: RawRow[] = XLSX.utils.sheet_to_json(sheet, {
      defval: "",
    });

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "File is empty" },
        { status: 400 }
      );
    }

    await connectDB();

    const results = {
      imported: 0,
      skipped: 0,
      errors: [] as string[],
    };

    for (const row of rows) {
      const { name, dobRaw, email, reminder } = parseRow(row);

      // Validate required fields
      if (!name || !dobRaw || !email) {
        results.skipped++;
        results.errors.push(
          `Skipped row — missing fields: ${JSON.stringify(row)}`
        );
        continue;
      }

      let dob: Date | null = null;

      if (dobRaw instanceof Date) {
        dob = dobRaw;
      } else {
        const dobString = String(dobRaw).trim();

        // Try ISO format first (YYYY-MM-DD)
        const isoMatch = dobString.match(
          /^(\d{4})-(\d{2})-(\d{2})/
        );

        if (isoMatch) {
          dob = new Date(
            `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`
          );
        }

        // Try DD/MM/YYYY
        if (!dob || isNaN(dob.getTime())) {
          const dmyMatch = dobString.match(
            /^(\d{1,2})\/(\d{1,2})\/(\d{4})/
          );

          if (dmyMatch) {
            dob = new Date(
              `${dmyMatch[3]}-${dmyMatch[2].padStart(
                2,
                "0"
              )}-${dmyMatch[1].padStart(2, "0")}`
            );
          }
        }

        // Fallback parsing
        if (!dob || isNaN(dob.getTime())) {
          dob = new Date(dobString);
        }
      }

      if (!dob || isNaN(dob.getTime())) {
        results.skipped++;
        results.errors.push(
          `Invalid date for "${name}": ${String(dobRaw)}`
        );
        continue;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        results.skipped++;
        results.errors.push(
          `Invalid email for "${name}": ${email}`
        );
        continue;
      }

      // Skip duplicates (same name + dob + user)
      const existing = await Birthday.findOne({
        user: session.user.id,
        name: {
          $regex: new RegExp(`^${name}$`, "i"),
        },
        dob,
      });

      if (existing) {
        results.skipped++;
        continue;
      }

      await Birthday.create({
        name,
        dob,
        email,
        reminder,
        user: session.user.id,
      });

      results.imported++;
    }

    return NextResponse.json({
      message: "Import complete",
      imported: results.imported,
      skipped: results.skipped,
      errors: results.errors.slice(0, 10),
    });
  } catch (err) {
    console.error("Import error:", err);

    return NextResponse.json(
      { message: "Import failed" },
      { status: 500 }
    );
  }
}
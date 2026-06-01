import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Birthday from "@/models/Birthday";
// @ts-ignore
import jsPDF from "jspdf";
// @ts-ignore
import autoTable from "jspdf-autotable";

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

function getDaysUntil(dob: Date): number {
  const today = new Date();
  const next = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
  if (next < today) next.setFullYear(today.getFullYear() + 1);
  return Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function getMonthName(month: number): string {
  return new Date(2000, month, 1).toLocaleString("en-US", { month: "long" });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  await connectDB();

  const birthdays = await Birthday.find({ user: session.user.id }).sort({ dob: 1 });

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // ── Cover Page ─────────────────────────────────────────────────────────
  // Orange header band
  doc.setFillColor(249, 115, 22);
  doc.rect(0, 0, pageW, 80, "F");

  // Decorative circle
  doc.setFillColor(255, 255, 255, 0.1);
  doc.circle(pageW - 20, 20, 40, "F");
  doc.circle(20, 70, 25, "F");

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(36);
  doc.text("Birthday Book", pageW / 2, 38, { align: "center" });

  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text("PingWish", pageW / 2, 52, { align: "center" });

  doc.setFontSize(11);
  doc.text(`${birthdays.length} birthdays · Generated ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`, pageW / 2, 64, { align: "center" });

  // Reset text color
  doc.setTextColor(26, 24, 20);

  // Owner name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(`${session.user.name}'s Birthday Book`, pageW / 2, 96, { align: "center" });

  // Divider
  doc.setDrawColor(249, 115, 22);
  doc.setLineWidth(0.5);
  doc.line(20, 102, pageW - 20, 102);

  // Upcoming section on cover
  const today = new Date();
  const upcoming = [...birthdays]
    .map((b) => ({ ...b.toObject(), days: getDaysUntil(b.dob) }))
    .sort((a, b) => a.days - b.days)
    .slice(0, 3);

  if (upcoming.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(249, 115, 22);
    doc.text("🎈 Coming Up Next", 20, 116);

    doc.setTextColor(26, 24, 20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    upcoming.forEach((b, i) => {
      const dob = new Date(b.dob);
      const dateStr = dob.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const daysStr = b.days === 0 ? "Today! 🎉" : b.days === 1 ? "Tomorrow!" : `in ${b.days} days`;
      doc.text(`${b.name}  ·  ${dateStr}  ·  ${daysStr}`, 24, 126 + i * 9);
    });
  }

  // ── Page 2+: Full list grouped by month ─────────────────────────────────
  doc.addPage();

  // Header on each data page
  doc.setFillColor(249, 115, 22);
  doc.rect(0, 0, pageW, 16, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("PingWish Birthday Book", 14, 11);
  doc.text(`${session.user.name}`, pageW - 14, 11, { align: "right" });

  doc.setTextColor(26, 24, 20);

  // Group by month
  const byMonth: Record<number, typeof birthdays> = {};
  birthdays.forEach((b) => {
    const month = new Date(b.dob).getMonth();
    if (!byMonth[month]) byMonth[month] = [];
    byMonth[month].push(b);
  });

  let yPos = 28;

  Object.entries(byMonth).forEach(([monthStr, entries]) => {
    const month = Number(monthStr);

    // Check if we need a new page
    if (yPos > pageH - 50) {
      doc.addPage();
      // Repeat header
      doc.setFillColor(249, 115, 22);
      doc.rect(0, 0, pageW, 16, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("PingWish Birthday Book", 14, 11);
      doc.text(`${session.user.name}`, pageW - 14, 11, { align: "right" });
      doc.setTextColor(26, 24, 20);
      yPos = 28;
    }

    // Month header
    doc.setFillColor(255, 247, 237);
    doc.roundedRect(14, yPos - 5, pageW - 28, 10, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(249, 115, 22);
    doc.text(getMonthName(month).toUpperCase(), 18, yPos + 2);
    doc.setTextColor(26, 24, 20);

    yPos += 12;

    // Table for this month
    autoTable(doc, {
      startY: yPos,
      head: [["Name", "Date", "Age", "Turns"]],
      body: entries.map((b) => {
        const dob = new Date(b.dob);
        const age = getAge(dob);
        const dateStr = dob.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        return [b.name, dateStr, String(age), String(age + 1)];
      }),
      theme: "plain",
      headStyles: {
        fillColor: [249, 115, 22],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
        cellPadding: 3,
      },
      bodyStyles: {
        fontSize: 9,
        cellPadding: 3,
        textColor: [26, 24, 20],
      },
      alternateRowStyles: {
        fillColor: [250, 250, 248],
      },
      columnStyles: {
        0: { cellWidth: 70, fontStyle: "bold" },
        1: { cellWidth: 35 },
        2: { cellWidth: 25, halign: "center" },
        3: { cellWidth: 25, halign: "center" },
      },
      margin: { left: 14, right: 14 },
    });

    yPos = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
  });

  // ── Footer on last page 
  const totalPages = (doc as any).getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(155, 147, 133);
    doc.text(
      `Page ${i} of ${totalPages}  ·  PingWish — Never Miss a Birthday`,
      pageW / 2,
      pageH - 8,
      { align: "center" }
    );
  }

  const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="pingwish-birthday-book.pdf"`,
    },
  });
}
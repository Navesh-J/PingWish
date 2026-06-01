import { NextResponse } from "next/server";
import { addDays, isSameDay } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { connectDB } from "@/lib/mongodb";
import Birthday from "@/models/Birthday";
import User from "@/models/User";
import { sendEmail } from "@/lib/mailer";

// Runs every hour via vercel.json cron: "0 * * * *"
// Only sends to users where it's currently 9AM in their timezone
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    const now = new Date();

    // Get all verified users
    const users = await User.find({ isVerified: true });

    let sent = 0;

    for (const user of users) {
      // Get current time in user's timezone
      const userTimezone = user.timezone || "Asia/Kolkata";
      const userNow = toZonedTime(now, userTimezone);
      const userHour = userNow.getHours();

      // Only proceed if it's 9AM in their timezone
      if (userHour !== 9) continue;

      const today = userNow;
      const tomorrow = addDays(today, 1);

      const birthdays = await Birthday.find({
        user: user._id,
        reminder: true,
      });

      for (const entry of birthdays) {
        const dob = entry.dob;
        const birthdayThisYear = new Date(
          today.getFullYear(),
          dob.getMonth(),
          dob.getDate()
        );

        if (isSameDay(birthdayThisYear, today)) {
          await sendEmail({
            to: entry.email,
            subject: `🎉 It's ${entry.name}'s Birthday Today!`,
            html: `
              <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 24px; border-radius: 12px; background: #fff7ed; border: 1px solid #fed7aa;">
                <h1 style="color: #ea580c; font-size: 28px; margin-bottom: 8px;">🎂 Happy Birthday, ${entry.name}!</h1>
                <p style="color: #374151; font-size: 16px;">Today is the big day! Don't forget to send your warmest wishes. 🥳</p>
                <p style="color: #6b7280; font-size: 13px; margin-top: 24px;">— PingWish, your birthday reminder buddy</p>
              </div>
            `,
          });
          sent++;
        } else if (isSameDay(birthdayThisYear, tomorrow)) {
          await sendEmail({
            to: entry.email,
            subject: `🎈 ${entry.name}'s Birthday is Tomorrow!`,
            html: `
              <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 24px; border-radius: 12px; background: #fff7ed; border: 1px solid #fed7aa;">
                <h1 style="color: #ea580c; font-size: 28px; margin-bottom: 8px;">🎁 Heads Up!</h1>
                <p style="color: #374151; font-size: 16px;">${entry.name}'s birthday is <strong>tomorrow</strong>. Time to plan something special! 🎊</p>
                <p style="color: #6b7280; font-size: 13px; margin-top: 24px;">— PingWish, your birthday reminder buddy</p>
              </div>
            `,
          });
          sent++;
        }
      }
    }

    return NextResponse.json({
      message: `✅ Processed ${users.length} users. Emails sent: ${sent}`,
    });
  } catch (err) {
    console.error("Cron error:", err);
    return NextResponse.json({ message: "Cron failed" }, { status: 500 });
  }
}
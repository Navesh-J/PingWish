import { NextResponse } from "next/server";
import { addDays, isSameDay } from "date-fns";
import { connectDB } from "@/lib/mongodb";
import Birthday from "@/models/Birthday";
import { sendEmail } from "@/lib/mailer";

// Vercel calls this at 3:30 UTC = 9:00 AM IST daily
export async function GET(req: Request) {
  // Protect the cron endpoint with a secret
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    const allBirthdays = await Birthday.find({ reminder: true });
    const today = new Date();
    const tomorrow = addDays(today, 1);

    let sent = 0;

    for (const entry of allBirthdays) {
      const dob = entry.dob;
      const birthdayThisYear = new Date(
        today.getFullYear(),
        dob.getMonth(),
        dob.getDate(),
      );

      if (isSameDay(birthdayThisYear, today)) {
        await sendEmail({
          to: entry.email,
          subject: `🎉 It's ${entry.name}'s Birthday Today!`,
          html: `
            <div style="background-color: #fafafa; padding: 40px 20px; font-family: 'DM Sans', 'Syne', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
              <div style="max-width: 520px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid #f3f4f6; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
                <div style="background: linear-gradient(135deg, #fb923c, #ea580c); padding: 32px 24px; text-align: center;">
                  <h1 style="color: #ffffff; font-size: 32px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">🎂 Happy Birthday!</h1>
                </div>
                <div style="padding: 32px 32px 40px;">
                  <h2 style="color: #111827; font-size: 22px; margin-top: 0;">It's the big day for ${entry.name}!</h2>
                  <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">Don't forget to send your warmest wishes and make their day extra special. 🥳</p>
                  <a href="#" style="display: inline-block; background-color: #f97316; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: 600; font-size: 16px;">Send a Wish Now</a>
                  <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 32px 0 24px;" />
                  <p style="color: #9ca3af; font-size: 13px; margin: 0; text-align: center;">— <strong>PingWish</strong>, your birthday reminder buddy</p>
                </div>
              </div>
            </div>
          `,
        });
        sent++;
      } else if (isSameDay(birthdayThisYear, tomorrow)) {
        await sendEmail({
          to: entry.email,
          subject: `🎈 ${entry.name}'s Birthday is Tomorrow!`,
          html: `
            <div style="background-color: #fafafa; padding: 40px 20px; font-family: 'DM Sans', 'Syne', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
              <div style="max-width: 520px; margin: 0 auto; background-color: #fff7ed; border-radius: 24px; overflow: hidden; border: 1px solid #ffedd5; box-shadow: 0 10px 25px -5px rgba(249, 115, 22, 0.05);">
                <div style="padding: 40px 32px;">
                  <div style="text-align: center; margin-bottom: 24px;">
                    <span style="font-size: 48px;">🎁</span>
                  </div>
                  <h1 style="color: #ea580c; font-size: 28px; font-weight: 700; margin: 0 0 16px; text-align: center; letter-spacing: -0.5px;">Heads Up!</h1>
                  <p style="color: #374151; font-size: 17px; line-height: 1.6; text-align: center; margin: 0;"><strong>${entry.name}'s</strong> birthday is tomorrow. Time to get that gift ready or plan something special! 🎊</p>
                  <hr style="border: none; border-top: 1px solid #fed7aa; margin: 32px 0 24px;" />
                  <p style="color: #9ca3af; font-size: 13px; margin: 0; text-align: center;">— <strong>PingWish</strong>, your birthday reminder buddy</p>
                </div>
              </div>
            </div>
          `,
        });
        sent++;
      }
    }

    return NextResponse.json({ message: `✅ Processed. Emails sent: ${sent}` });
  } catch (err) {
    console.error("Cron error:", err);
    return NextResponse.json({ message: "Cron failed" }, { status: 500 });
  }
}

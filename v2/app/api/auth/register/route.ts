import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { sendEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const { name, email, password, timezone } = await req.json();

    if (!name || !email || !password)
      return NextResponse.json(
        { message: "All fields required" },
        { status: 400 },
      );

    if (password.length < 8)
      return NextResponse.json(
        { message: "Password must be at least 8 characters" },
        { status: 400 },
      );

    await connectDB();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (!existing.isVerified) {
        // Resend verification email instead of blocking
        const verifyToken = crypto.randomBytes(32).toString("hex");
        const verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await User.updateOne(
          { _id: existing._id },
          { $set: { verifyToken, verifyTokenExpiry } },
        );

        const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${verifyToken}`;

        await sendEmail({
          to: existing.email,
          subject: "Verify your PingWish account",
          html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: auto; padding: 32px; border-radius: 16px; background: #fff7ed; border: 1px solid #fed7aa;">
          <div style="text-align: center; margin-bottom: 24px;">
            <span style="font-size: 40px;">🎂</span>
            <h1 style="color: #ea580c; font-size: 24px; margin: 8px 0 0;">PingWish</h1>
          </div>
          <h2 style="color: #1a1814; font-size: 20px; margin-bottom: 8px;">Welcome, ${existing.name}! 🎉</h2>
          <p style="color: #6b6558; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
            Here's a fresh verification link for your account.
          </p>
          <a href="${verifyUrl}"
            style="display: inline-block; background: #f97316; color: white; font-weight: 700; font-size: 15px; padding: 14px 28px; border-radius: 12px; text-decoration: none;">
            Verify Email →
          </a>
          <p style="color: #9b9385; font-size: 13px; margin-top: 24px;">
            This link expires in <strong>24 hours</strong>.
          </p>
        </div>
      `,
        });

        return NextResponse.json(
          {
            message:
              "Account exists but is unverified. A new verification link has been sent.",
          },
          { status: 200 },
        );
      }
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 400 },
      );
    }

    const verifyToken = crypto.randomBytes(32).toString("hex");
    const verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await User.create({
      name,
      email,
      password,
      timezone: timezone || "Asia/Kolkata",
      isVerified: false,
    });

    await User.updateOne(
      { _id: user._id },
      { $set: { verifyToken, verifyTokenExpiry } },
    );

    const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${verifyToken}`;

    await sendEmail({
      to: email,
      subject: "Verify your PingWish account",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: auto; padding: 32px; border-radius: 16px; background: #fff7ed; border: 1px solid #fed7aa;">
          <div style="text-align: center; margin-bottom: 24px;">
            <span style="font-size: 40px;">🎂</span>
            <h1 style="color: #ea580c; font-size: 24px; margin: 8px 0 0;">PingWish</h1>
          </div>
          <h2 style="color: #1a1814; font-size: 20px; margin-bottom: 8px;">Welcome, ${name}! 🎉</h2>
          <p style="color: #6b6558; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
            Thanks for signing up! Please verify your email address to start using PingWish.
          </p>
          <a href="${verifyUrl}"
            style="display: inline-block; background: #f97316; color: white; font-weight: 700; font-size: 15px; padding: 14px 28px; border-radius: 12px; text-decoration: none; box-shadow: 0 4px 14px rgba(249,115,22,0.35);">
            Verify Email →
          </a>
          <p style="color: #9b9385; font-size: 13px; margin-top: 24px;">
            This link expires in <strong>24 hours</strong>.
          </p>
          <hr style="border: none; border-top: 1px solid #e8e4dc; margin: 24px 0;" />
          <p style="color: #9b9385; font-size: 12px;">— PingWish, your birthday reminder buddy 🎉</p>
        </div>
      `,
    });

    return NextResponse.json(
      { message: "Account created. Please verify your email." },
      { status: 201 },
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { sendEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email)
    return NextResponse.json({ message: "Email required" }, { status: 400 });

  await connectDB();

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user)
    return NextResponse.json({ message: "No account found with that email." }, { status: 404 });

  if (user.isVerified)
    return NextResponse.json({ message: "This email is already verified." }, { status: 400 });

  const verifyToken = crypto.randomBytes(32).toString("hex");
  const verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await User.updateOne(
    { _id: user._id },
    { $set: { verifyToken, verifyTokenExpiry } }
  );

  const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${verifyToken}`;

  await sendEmail({
    to: user.email,
    subject: "Verify your PingWish account",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto; padding: 32px; border-radius: 16px; background: #fff7ed; border: 1px solid #fed7aa;">
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="font-size: 40px;">🎂</span>
          <h1 style="color: #ea580c; font-size: 24px; margin: 8px 0 0;">PingWish</h1>
        </div>
        <h2 style="color: #1a1814; font-size: 20px; margin-bottom: 8px;">Verify your email</h2>
        <p style="color: #6b6558; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
          Here's a fresh verification link for your PingWish account.
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

  return NextResponse.json({ message: "Verification email sent!" });
}
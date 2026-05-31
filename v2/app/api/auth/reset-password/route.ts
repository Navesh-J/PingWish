import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { sendEmail } from "@/lib/mailer";

// POST /api/auth/reset-password
// Body: { email } → sends reset link
// Body: { token, password } → sets new password

export async function POST(req: Request) {
  const body = await req.json();
  await connectDB();

  // ── Step 1: Request reset link ──────────────────────────────────────────
  if (body.email && !body.token) {
    const { email } = body;
    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return success — don't leak whether email exists
    if (!user) {
      return NextResponse.json(
        { message: "No account found with that email address." },
        { status: 404 },
      );
    }

    // Generate a secure random token, valid for 1 hour
    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          resetToken: token,
          resetTokenExpiry: new Date(Date.now() + 60 * 60 * 1000),
        },
      },
    );

    // Verify it saved correctly
    const check = await User.findOne({ email: user.email });
    console.log("Saved token:", check?.resetToken);
    console.log("Token match:", check?.resetToken === token);

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${encodeURIComponent(token)}`;

    await sendEmail({
      to: user.email,
      subject: "Reset your PingWish password",
      html: `
        <div style="font-family: 'DM Sans', sans-serif; max-width: 480px; margin: auto; padding: 32px; border-radius: 16px; background: #fff7ed; border: 1px solid #fed7aa;">
          <div style="text-align: center; margin-bottom: 24px;">
            <span style="font-size: 40px;">🎂</span>
            <h1 style="font-family: 'Syne', sans-serif; color: #ea580c; font-size: 24px; margin: 8px 0 0;">PingWish</h1>
          </div>
          <h2 style="color: #1a1814; font-size: 20px; margin-bottom: 8px;">Reset your password</h2>
          <p style="color: #6b6558; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
            Someone (hopefully you!) requested a password reset for your PingWish account. Click the button below to set a new password.
          </p>
          <a href="${resetUrl}"
            style="display: inline-block; background: #f97316; color: white; font-weight: 700; font-size: 15px; padding: 14px 28px; border-radius: 12px; text-decoration: none; box-shadow: 0 4px 14px rgba(249,115,22,0.35);">
            Reset Password →
          </a>
          <p style="color: #9b9385; font-size: 13px; margin-top: 24px;">
            This link expires in <strong>1 hour</strong>. If you didn't request this, you can safely ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #e8e4dc; margin: 24px 0;" />
          <p style="color: #9b9385; font-size: 12px;">— PingWish, your birthday reminder buddy 🎉</p>
        </div>
      `,
    });

    return NextResponse.json({
      message: "Reset link sent! Check your inbox.",
    });
  }

  // ── Step 2: Confirm new password ────────────────────────────────────────
  if (body.token && body.password) {
    const { token, password } = body;

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }, // token not expired
    });

    if (!user) {
      return NextResponse.json(
        {
          message:
            "This reset link is invalid or has expired. Please request a new one.",
        },
        { status: 400 },
      );
    }

    user.password = password;
    await user.save(); // pre-save hook hashes the password

    await User.updateOne(
      { _id: user._id },
      { $unset: { resetToken: "", resetTokenExpiry: "" } },
    );

    return NextResponse.json({ message: "Password updated successfully." });
  }

  return NextResponse.json({ message: "Invalid request" }, { status: 400 });
}

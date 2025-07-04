import { Resend } from "resend";
import ejs from "ejs";
import fs from "fs";
import path from "path";
import { config } from "../config/config";

interface ApiResponse {
  message: string;
  success: boolean;
}

const resend = new Resend(config.RESEND_API_KEY);

export async function sendVerificationEmail(
  email: string,
  fullName: string,
  verifyCode: string
): Promise<ApiResponse> {
  const templatePath = path.resolve(__dirname, "../../views/emailTemplate.ejs");
  const template = fs.readFileSync(templatePath, "utf-8");
  const html = ejs.render(template, { fullName, verifyCode });
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "verification code",
      html,
    });
    return { message: "Verification email sent successfully", success: true };
  } catch (emailError: any) {
    console.error("error sending verification email", emailError.message);
    return { message: "Failed sending verification email", success: false };
  }
}

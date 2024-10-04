import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (email: string, token: string) => {
  const confirmationLink = `http://localhost:3000/confirm-email?token=${token}`;

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Confirm your email - TEST",
      html: `<a href="${confirmationLink}">Click here to confirm your email</a>`,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetPasswordLink = `http://localhost:3000/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Invoiceraptor-Reset password",
    html: `<p>Click <a href="${resetPasswordLink}">here</a> to reset your password</p>
`,
  });
};

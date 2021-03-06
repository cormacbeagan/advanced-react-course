import { createTransport, getTestMessageUrl } from 'nodemailer';

const transport = createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

//* the second string outside the brackets is the typing of the return value
function makeANiceEmail(text: string): string {
  return `
    <div
        style="
            background: grey;
            border: 1px solid black;
            padding: 20px;
            font-family: sans-serif;
            line-height: 2;
            font-size: 20px;
        ">
        <h2>Dear User</h2>
        <p>${text}</p>
        <p> Sick Fits inc.</p>
    </div>
    `;
}

export async function sendPasswordResetEmail(
  resetToken: string,
  to: string
): Promise<void> {
  const info = await transport.sendMail({
    to,
    from: 'test@example.com',
    subject: 'Your password reset email',
    html: makeANiceEmail(
      `Your reset link is here 
      <a href="${process.env.FRONTEND_URL}/reset?token=${resetToken}" >Click here to reset</a>`
    ),
  });
  if (process.env.MAIL_USER.includes('ethereal.email')) {
    console.log(`Message sent - view message at ${getTestMessageUrl(info)}`);
  }
}

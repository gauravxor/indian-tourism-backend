export const OtpTemplate = {
    subject: 'Your OTP Code',
    html: ({ name, otp }: { name: string; otp: string }) => `
    <div>
      <h2>Hello ${name},</h2>
      <p>Your OTP is: <strong>${otp}</strong></p>
    </div>
  `,
};

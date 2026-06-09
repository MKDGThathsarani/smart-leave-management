const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"Smart Leave Management" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error('❌ Email error:', error);
  }
};

const sendLeaveApplicationEmail = async (user, leave, approver) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4F46E5;">New Leave Application</h2>
      <p>Dear ${approver.name},</p>
      <p><strong>${user.name}</strong> has submitted a leave application:</p>
      <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Leave Type:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${leave.leaveType}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Duration:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${leave.startDate} to ${leave.endDate} (${leave.totalDays} days)</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Reason:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${leave.reason}</td></tr>
      </table>
      <p>Please login to the system to approve or reject this application.</p>
      <hr style="margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">Smart Leave Management System</p>
    </div>
  `;
  
  await sendEmail({ to: approver.email, subject: 'New Leave Application', html });
};

module.exports = { sendEmail, sendLeaveApplicationEmail };
import nodemailer from "nodemailer";

interface ContactInquiryEmailProps {
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
}

interface StandBriefEmailProps {
  referenceCode: string;
  companyName: string;
  contactPerson: string;
  email: string;
  contactNumber: string;
  standSize: string;
  standType: string;
  budget: string;
  currency: string;
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE !== "false";

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
}

export async function sendContactNotification(data: ContactInquiryEmailProps) {
  try {
    const transporter = getTransporter();
    const recipient = process.env.CONTACT_NOTIFICATION_EMAIL || process.env.SMTP_USER || "sales@impactmakersevents.com";
    const fromAddress = process.env.SMTP_FROM || `"IMPACT B2B Portal" <${process.env.SMTP_USER || "no-reply@impactmakersevents.com"}>`;

    if (!transporter) {
      console.log("[Email Notification] SMTP not configured. Skipped sending email for contact inquiry:", data.email);
      return false;
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <div style="background-color: #003E95; padding: 16px; border-radius: 6px; text-align: center; color: white;">
          <h2 style="margin: 0;">New Contact Inquiry Received</h2>
          <p style="margin: 4px 0 0 0; font-size: 14px; opacity: 0.9;">Impact Makers Events Platform</p>
        </div>
        <div style="padding: 20px 0;">
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
          <p><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
          <p><strong>Subject:</strong> ${data.subject || "General Inquiry"}</p>
          <div style="margin-top: 16px; padding: 12px; background-color: #f8fafc; border-left: 4px solid #00A7F5; border-radius: 4px;">
            <p style="margin: 0; font-weight: bold; color: #334155;">Message:</p>
            <p style="margin: 8px 0 0 0; white-space: pre-wrap; color: #475569;">${data.message}</p>
          </div>
        </div>
        <div style="border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 12px; color: #94a3b8; text-align: center;">
          This is an automated dispatch from the IMPACT B2B Portal.
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: fromAddress,
      to: recipient,
      replyTo: data.email,
      subject: `[New Inquiry] ${data.subject || "Contact Form"} - ${data.name}`,
      html: htmlContent,
    });

    return true;
  } catch (err) {
    console.error("[Email Notification Error]", err);
    return false;
  }
}

export async function sendStandBriefNotification(data: StandBriefEmailProps) {
  try {
    const transporter = getTransporter();
    const recipient = process.env.CONTACT_NOTIFICATION_EMAIL || process.env.SMTP_USER || "sales@impactmakersevents.com";
    const fromAddress = process.env.SMTP_FROM || `"IMPACT B2B Portal" <${process.env.SMTP_USER || "no-reply@impactmakersevents.com"}>`;

    if (!transporter) {
      console.log("[Email Notification] SMTP not configured. Skipped sending email for stand brief:", data.referenceCode);
      return false;
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <div style="background: linear-gradient(135deg, #003E95, #00A7F5); padding: 20px; border-radius: 6px; text-align: center; color: white;">
          <h2 style="margin: 0;">New Stand Architecture Brief: ${data.referenceCode}</h2>
          <p style="margin: 6px 0 0 0; font-size: 14px; opacity: 0.9;">High-Priority Exhibition Submission</p>
        </div>
        <div style="padding: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 160px;">Reference Code:</td>
              <td style="padding: 8px 0; font-weight: bold; color: #003E95;">${data.referenceCode}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Company Name:</td>
              <td style="padding: 8px 0; font-weight: bold; color: #1e293b;">${data.companyName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Contact Person:</td>
              <td style="padding: 8px 0; color: #1e293b;">${data.contactPerson} (<a href="mailto:${data.email}">${data.email}</a>, ${data.contactNumber})</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Stand Specifications:</td>
              <td style="padding: 8px 0; color: #1e293b;">${data.standSize} (${data.standType})</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Target Budget:</td>
              <td style="padding: 8px 0; font-weight: bold; color: #059669;">${data.currency} ${data.budget}</td>
            </tr>
          </table>
        </div>
        <div style="border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 12px; color: #94a3b8; text-align: center;">
          Log into the <a href="${process.env.NEXT_PUBLIC_APP_URL || ""}/admin/briefs" style="color: #00A7F5;">Admin Dashboard</a> to view full 3D and AV requirements.
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: fromAddress,
      to: recipient,
      replyTo: data.email,
      subject: `[Stand Brief ${data.referenceCode}] ${data.companyName} - ${data.standSize}`,
      html: htmlContent,
    });

    return true;
  } catch (err) {
    console.error("[Email Notification Error]", err);
    return false;
  }
}

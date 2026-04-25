require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// POST /api/book endpoint
app.post('/api/book', async (req, res) => {
  const { name, email, phone, date, time, doctorEmail, doctorPhone } = req.body;
  if (!name || !email || !phone || !date || !time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Compose messages
  const patientMsg = `Dear ${name}, your appointment is confirmed for ${date} at ${time}.`;
  const doctorMsg = `New appointment: ${name}, Email: ${email}, Phone: ${phone}, Date: ${date}, Time: ${time}`;

  // Send WhatsApp messages (using WhatsApp Cloud API)
  try {
    // Patient WhatsApp
    await sendWhatsApp(phone, patientMsg);
    // Doctor WhatsApp
    if (doctorPhone) await sendWhatsApp(doctorPhone, doctorMsg);
  } catch (err) {
    console.error('WhatsApp error:', err.message);
  }

  // Send Emails
  try {
    await sendEmail(email, 'Appointment Confirmation', patientMsg);
    if (doctorEmail) await sendEmail(doctorEmail, 'New Appointment Booked', doctorMsg);
  } catch (err) {
    console.error('Email error:', err.message);
  }

  res.json({ success: true });
});

// WhatsApp Cloud API sender
async function sendWhatsApp(to, message) {
  const url = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_ID}/messages`;
  const data = {
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: { body: message }
  };
  await axios.post(url, data, {
    headers: {
      'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });
}

// Nodemailer sender
async function sendEmail(to, subject, text) {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, text });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

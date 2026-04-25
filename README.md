# Appointment Booking Backend

This Node.js/Express backend handles appointment bookings and sends WhatsApp and email notifications to both patient and doctor automatically.

## Features
- Receives booking data via POST `/api/book`
- Sends WhatsApp messages to patient and doctor (using WhatsApp Cloud API)
- Sends email notifications to patient and doctor (using Nodemailer)
- No WhatsApp redirect for patient

## Setup
1. Install dependencies:
   ```sh
   npm install
   ```
2. Configure environment variables in `.env`:
   - `WHATSAPP_PHONE_ID`: Your WhatsApp Cloud API phone number ID
   - `WHATSAPP_TOKEN`: Your WhatsApp Cloud API access token
   - `EMAIL_SERVICE`: e.g., `gmail`
   - `EMAIL_USER`: Your email address
   - `EMAIL_PASS`: Your email password or app password
3. Start the server:
   ```sh
   node index.js
   ```

## API Usage
POST `/api/book`
```json
{
  "name": "Patient Name",
  "email": "patient@email.com",
  "phone": "919999999999",
  "date": "2026-05-01",
  "time": "10:00 AM",
  "doctorEmail": "doctor@email.com",
  "doctorPhone": "919888888888"
}
```

## Notes
- WhatsApp and email credentials must be valid for notifications to work.
- For production, use secure storage for credentials.

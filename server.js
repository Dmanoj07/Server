const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// CORS configuration for production
app.use(cors({
  origin: [
    'http://localhost:3000', // for development
    'https://your-frontend-domain.vercel.app', // Replace with your actual Vercel domain
    // Add more domains as needed
  ],
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(bodyParser.json());

// Basic route to test if server is running
app.get('/', (req, res) => {
  res.json({ message: 'Portfolio Backend Server is running!' });
});

// Handle the POST request for sending emails
app.post('/send', (req, res) => {
  const { name, email, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, //environment variable
      pass: process.env.EMAIL_PASS, //environment variable
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.RECIPIENT_EMAIL, // Use environment variable
    subject: `New message from ${name}`,
    html: `
      <h3>New Contact Form Message</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
    replyTo: email
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'Error sending email' });
    }
    console.log('Email sent successfully:', info.response);
    res.status(200).json({ message: 'Email sent successfully' });
  });
});

// Handle 404 for unknown routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Use environment PORT or default to 3001
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
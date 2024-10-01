const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Handle the POST request for sending emails
app.post('/send', (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'frenzyfact7@gmail.com', // your Gmail account
      pass: 'pkbm snnx ohbo picb', // your Gmail password or app password
    },
  });

  const mailOptions = {
    from: email,
    to: 'manoj123dhami@gmail.com',
    subject: `New message from ${name}`,
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('Error sending email:', error); // Log the error
        return res.status(500).send('Error sending email');
    }
    res.status(200).send('Email sent successfully');
  });
});

app.listen(3001, () => {
  console.log('Server started on port 3001');
});

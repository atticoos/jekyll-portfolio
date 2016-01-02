'use strict';

import nodemailer from 'nodemailer';

var transport = nodemailer.createTransport(null, {
  from: 'site@atticuswhite.com'
});

export function contactFormHandler (req, res, next) {
  sendContactEmail(
    req.query.email,
    req.query.name,
    req.query.message
  );
  res.send();
  next();
}

function sendContactEmail (name, email, message) {
  var emailBody = `
  New contact form submission:<br/><br/>
  Name: ${name}<br/>
  Email: ${email}<br/>
  Message: ${message}
  `;
  transport.sendMail({
    to: 'contact@atticuswhite.com',
    subject: 'Website - Contact Form',
    text: emailBody
  });
}

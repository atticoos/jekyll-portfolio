'use strict';

import nodemailer from 'nodemailer';
import request from 'request';

const slackEndpoint = process.env.PORTFOLIO_SLACK_WEBHOOK;

var transport = nodemailer.createTransport(null, {
  from: 'site@atticuswhite.com'
});

export function contactFormHandler (req, res, next) {
  sendContactEmail(
    req.body.name,
    req.body.email,
    req.body.message
  );
  sendSlackWebhook(
    req.body.name,
    req.body.email,
    req.body.message
  );
  res.status(200).send();
  return next();
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

function sendSlackWebhook (name, email, message) {
  request({
    uri: slackEndpoint,
    username: 'Courier',
    method: 'POST',
    json: true,
    body: {
      text: 'You have received a new message on your website',
      attachments: [
        {
          fallback: `Message from ${name} (${email}). See email for details`,
          fields: [
            {
              title: 'Name',
              value: name,
              short: true
            },
            {
              title: 'Email',
              value: email,
              short: true
            },
            {
              title: 'Message',
              value: message,
              short: false
            }
          ]
        }
      ]
    }
  });
}

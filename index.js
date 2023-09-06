const express = require('express');
const app = express();
const port = 3000;

const { validate } = require('./src/validation');
const { MailService } = require('./src/mail-service');

// Use express middleware to process JSON requests
app.use(express.json());

// Users can provide one or more email providers
const EMAIL_PROVIDERS = process.env.EMAIL_PROVIDERS.split(',');

// Map the given provider labels to their service
const providers = EMAIL_PROVIDERS.map(providerLabel => {
  return require(`./src/providers/${providerLabel}`);
});

// This endpoint takes the following parameters:
//
// to - the email address to send to
// to_name - the name to accompany the email
// from - the email address in the from and reply fields
// from_name - the name to accompany the from/reply emails
// subject - The subject line of the email
// body - the HTML body of the email
// 
// Example:
//   {
//     "to": "matthew.willhite@gmail.com",
//     "to_name": "Mr. Fake",
//     "from": "no-reply@fake.com",
//     "from_name":"Ms. Fake",
//     "subject": "A message from The Fake Family",
//     "body": "<h1>Your Bill</h1><p>$10</p>"
//   }
//
app.post('/email', (req, res) => {
  // Validate the params and extract any errors
  const { errors, params } = validate(req.body);
  if (errors.length) {
    res.status(422).send({ errors });
    return;
  }

  // Run the mail service with the validated params
  MailService(providers)
    .run(params)
    // For now we just return an OK if the mail was sent successfully
    .then(() => {
      res.sendStatus(200);
    })
    // Our failures should provide some context about why they failed
    // {
    //   providerLabel: 'MAILGUN' | 'SENDGRID'
    //   error: Error {
    //     status: HTTPStatus
    //     statusText: String
    //   }
    // }
    .catch(({ error, providerLabel }) => {
      res.status(error.status || 500).send(`[${providerLabel}] ${error.statusText}`);
    });
});

// Run the app
app.listen(port, () => {
  console.log(`Email Service listening on port ${port}`)
});
// An example request:
// curl --request POST \
// --url https://api.sendgrid.com/v3/mail/send \
// --header 'Authorization: Bearer <<YOUR_API_KEY>>' \
// --header 'Content-Type: application/json' \
// --data '{"personalizations":[{"to":[{"email":"john.doe@example.com","name":"John Doe"}],"subject":"Hello, World!"}],"content": [{"type": "text/plain", "value": "Heya!"}],"from":{"email":"sam.smith@example.com","name":"Sam Smith"},"reply_to":{"email":"sam.smith@example.com","name":"Sam Smith"}}'
//
const { convert } = require('html-to-text');
const { handleError } = require('.');

const API_KEY = process.env.SENDGRID_API_KEY;

const SendgridProvider = {
  send: async params => {
    const url = `https://api.sendgrid.com/v3/mail/send`;
    const body = JSON.stringify({
      personalizations: {
        to: {
          email: params.to,
          name: params.to_name,
        },
        subject: params.subject,
      },
      content: [
        {
          type: 'text/html',
          value: params.body,
        },
        {
          type: 'text/plain',
          value: convert(params.body),
        }
      ],
      from: {
        email: params.from,
        name: params.from_name,
      },
    });

    return await fetch(url, {
      method: 'POST',
      headers: new Headers({
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      }),
      body,
    })
    .then(handleError);
  }
}

module.exports = { label: 'SENDGRID', ...SendgridProvider };
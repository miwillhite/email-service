// An example request:
// curl -s --user 'api:<API_KEY>' \
//     https://api.mailgun.net/v3/<DOMAIN>/messages \
//     -F from='Excited User <mailgun@YOUR_DOMAIN_NAME>' \
//     -F to=matthew.willhite@gmail.com \
//     -F subject='Hello' \
//     -F text='Testing some Mailgun awesomeness!'
//
const { convert } = require('html-to-text');
const btoa = require('btoa');
const { handleError } = require('.');

const API_KEY = process.env.MAILGUN_API_KEY;
const DOMAIN = process.env.MAILGUN_DOMAIN;

const MailgunProvider = {
  send: async params => {

    const url = `https://api.mailgun.net/v3/${DOMAIN}/messages`;
    const body = new FormData();
    body.append('from', [params.from_name, params.from].join(' '));
    body.append('to', [params.to_name, params.to].join(' '));
    body.append('subject', params.subject);
    body.append('html', params.body);
    body.append('text', convert(params.body));

    return await fetch(url, {
      method: 'POST',
      headers: new Headers({
        'Authorization': `Basic ${btoa('api:' + API_KEY)}`
      }),
      body,
    })
    .then(handleError);
  }
}

module.exports = { label: 'MAILGUN', ...MailgunProvider };
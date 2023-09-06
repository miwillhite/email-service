# Email Service

## Dependencies

* [node](https://nodejs.org/) v18+
* [yarn](https://yarnpkg.com/) v3.6+


## Getting Started
From the project root:

```bash
# Install dependencies
yarn

# Start server (on port 3000)
EMAIL_PROVIDERS=mailgun,sendgrid \
MAILGUN_API_KEY=your_mailgun_key \
MAILGUN_DOMAIN=your_mailgun_domain \
SENDGRID_API_KEY=your_sendgrid_key \
node index.js
```

## API

I used Postman to exercise the API, with variations of the following:

### POST `/email`

```curl
curl --location 'http://localhost:3000/email' \
--header 'Content-Type: application/json' \
--data-raw '{
    "to": "matthew.willhite@gmail.com",
    "to_name": "Mr. Fake",
    "from": "no-reply@fake.com",
    "from_name": "Ms. Fake",
    "subject": "A message from The Fake Family",
    "body": "<h1>Your Bill</h1><p>$100</p>"
  }'
```

## Unit Testing

```bash
yarn test
```

## Features To Note

### Automatic Failover
You can pass in one the following values for email providers:
```bash
  EMAIL_PROVIDERS=mailgun
  EMAIL_PROVIDERS=sendgrid
  EMAIL_PROVIDERS=mailgun,sendgrid
  EMAIL_PROVIDERS=sendgrid,mailgun
```
More than one value given will attempt the first provider, if there is an error it will failover to the next.
If only one value is provided, only one attempt will be made.

## Development Approach

I started by sketching out how the service would work from request to response.

Then I started to think about how the provider toggle might work and it occurred to me that it would interesting to try an automatic failover. If one service fails then we can immediately invoke the other.

I wanted a simple interface, so I decided that a provider list of one or more elements would be the best fit.
After roughing out the MailService and writing some specs to back it (this was quick because the providers are easily stubbed),
I started writing the providers for each.

**Disclaimer: Sendgrid did not allow me to create an account, after signing up they stated that I was in violation of their agreement and would not let me acces my account. I used this provider as a "failure control" to test my automatic failover functionality.**

I don't typically practice TDD, rather I rough out what I want to see in code sometimes even a working POC, then I'll write specs around it, then implement the specs and the code to back it. There is usually some back-and-forth if I'm not exactly sure how I want the details to look.

In this case, I spent a little too much time around error handling and ended up implementing a "good enough" solution that I'd want to return to.

Finally, I would normally write this in TypeScript, but I still move just a little bit faster in JS and I didn't want to risk getting hung up. I 100% believe that TS is a better choice.

### Time Spent

Maybe ~30–45m in planning and sketching. \
Another ~4hrs in research and implementation (the auto-failover probably inflated the time by an hour or so). \
~20m in documentation and this README.

I had to look up some details around error handling patterns with the Fetch API in Node (not as straightforward as I had hoped), as well as building up the proper requests for the different APIs.

### TODO

* Testing could be a bit more fleshed out, esp. around higher level tests and specs for the providers
* Logging and error handling could be more robust (e.g. validate the providers)
const { validate } = require('.');

describe('Validation', () => {

  describe('with blank values', () => {
    const params = {
      'to_name': '',
      'from': 'no-reply@fake.com',
      'from_name': 1,
      'subject': 'A message from The Fake Family',
      'body': '<h1>Your Bill</h1><p>$10</p>',
    };

    it('returns an error entry for each blank value', () => {
      expect(validate(params).errors).toEqual(expect.arrayContaining([
        ['to_name', 'is blank'],
        ['to', 'is blank'],
        ['from_name', 'is blank'],
      ]));
    });
  });

  describe('with invalid emails', () => {
    const params = {
      'to': 'to@',
      'to_name': 'To Name',
      'from': 'no-reply@fakecom',
      'from_name': 'From Name',
      'subject': 'A message from The Fake Family',
      'body': '<h1>Your Bill</h1><p>$10</p>',
    };

    it('returns an error entry for each invalid email', () => {
      expect(validate(params).errors).toEqual(expect.arrayContaining([
        ['to', 'is not a valid email'],
        ['from', 'is not a valid email'],
      ]));
    });
  })

});
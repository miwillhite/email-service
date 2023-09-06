// Test if is string and is not blank
const isPresent = value => !(typeof value === 'string' && Boolean(value.length));

// Super simple test, keep it loose
const isValidEmail = string => /\S+@\S+\.\S+/.test(string);

const REQUIRED_KEYS = ['to', 'to_name', 'from', 'from_name', 'subject', 'body'];

const Validation = {
  validate: params => {
    // Run validations against all required keys, collecting the results
    const errors = REQUIRED_KEYS.reduce((errs, key) => {
      // Note: Consider a value "not present" if it isn't a string
      if (isPresent(params[key])) {
        errs.push([key, 'is not present']);
      }
      // Make sure we are working with emails
      if (['to', 'from'].includes(key) && !isValidEmail(params[key])) {
        errs.push([key, 'is not a valid email']);
      }
      return errs;
    }, []);

    return {
      errors,
      params,
    }
  },
};

module.exports = Validation;
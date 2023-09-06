// The fetch API doesn't give us a clean way to propagate HTTP errors
// So we add this "middleware" to allow errors to bubble up.
const handleError = response => {
  if (response.ok) {
    return response;
  } else {
    // TODO Make this a proper error with prototype
    throw {
      statusText: response.statusText,
      status: response.status
    };
  }
};

module.exports = { handleError };
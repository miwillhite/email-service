function MailService (providers) {
  // We'll use this to collect errors from failed services in the case of automatic failover
  let errors = [];

  const run = params => {
    if (providers.length < 1) {
      throw new Error('MailService must be run with at least one Provider');
    };

    // Grab the first provider (there may be only one)
    const currentProvider = providers[0];

    // A stock response, success and failure will decorate this accordingly
    const result = {
      providerLabel: currentProvider.label,
    };

    return currentProvider
      .send(params)
      .then(() => ({
        ...result,
        success: true,
      }))
      .catch(error => {
        // Capture the error for context
        errors.push(error);

        // TODO Send error to logger service like Sumo or CloudWatch
        // Logger.send(error);

        // If there are any failover providers, try them,
        // otherwise return the failure with context.
        const failoverProviders = providers.slice(1);
        if (Boolean(failoverProviders.length)) {
          return MailService(failoverProviders).run(params);
        } else {
          return Promise.reject({
            // Return the last error, in the future we may be able to provide
            // the others to offer more context about service failures.
            error: errors[errors.length-1],
            ...result,
            success: false,
          });
        }
      });
  };

  return { run };
};

module.exports = { MailService };
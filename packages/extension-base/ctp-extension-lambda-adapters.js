// AWS Lambda

const createReject = callback => error => {
  callback(null, {
    responseType: 'FailedValidation',
    errors: Array.isArray(error) ? error : [error],
  });
};

const createAccept = callback => (update = []) => {
  callback(null, {
    responseType: 'UpdateRequest',
    actions: Array.isArray(update) ? update : [update],
  });
};

const ctpResponse = callback => ({
  reject: createReject(callback),
  accept: createAccept(callback),
});

module.exports = {
  createExtensionAdapter: fn => (event, context, callback) => {
    fn(event, ctpResponse(callback), console.log);
  },
};

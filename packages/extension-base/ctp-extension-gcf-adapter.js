// Google Cloud Functions

module.exports = {
  ctpExtensionAdapter: function(fn) {
    return function(req, res) {
      fn(req.body, ctpResponse(res), console.log);
    };
  }
};

function ctpResponse(res) {
  return {
    reject: createReject(context),
    accept: createAccept(context)
  };
}

const createReject = context => error => {
  var errorArray = Array.isArray(error) ? error : [error];
  res.status(400).json({
    errors: errorArray
  });
};

const createAccept = context => (update = []) => {
  var actionsArray = Array.isArray(update) ? update : [update];
  res.status(200).json({
    actions: actionsArray
  });
};

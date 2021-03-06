// Google Cloud Functions

const createReject = ctx => error => {
  ctx.status(400).json({
    errors: Array.isArray(error) ? error : [error],
  });
};

const createAccept = ctx => (update = []) => {
  ctx.status(200).json({
    actions: Array.isArray(update) ? update : [update],
  });
};

const ctpResponse = ctx => ({
  reject: createReject(ctx),
  accept: createAccept(ctx),
});

module.exports = {
  createExtensionAdapter: fn => (req, res) => {
    fn(req.body, ctpResponse(res), console.log);
  },
};

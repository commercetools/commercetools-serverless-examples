// Google Cloud Functions

const createReject = ctx => error => {
  const errorArray = Array.isArray(error) ? error : [error];
  ctx.status(400).json({
    errors: errorArray,
  });
};

const createAccept = ctx => (update = []) => {
  const actionsArray = Array.isArray(update) ? update : [update];
  ctx.status(200).json({
    actions: actionsArray,
  });
};

const ctpResponse = ctx => ({
  reject: createReject(ctx),
  accept: createAccept(ctx),
});

module.exports = {
  ctpExtensionAdapter: fn => (ctx, req) => {
    fn(req.body, ctpResponse(ctx), ctx.log);
  },
};

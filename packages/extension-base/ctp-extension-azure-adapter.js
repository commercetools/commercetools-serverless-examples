// Azure

const createReject = ctx => error => {
  ctx.res = {
    status: 400,
    body: {
      errors: Array.isArray(error) ? error : [error],
    },
  };
  ctx.done();
};

const createAccept = ctx => (update = []) => {
  ctx.res = {
    status: 200,
    body: {
      actions: Array.isArray(update) ? update : [update],
    },
  };
  ctx.done();
};

const ctpResponse = ctx => ({
  reject: createReject(ctx),
  accept: createAccept(ctx),
});

module.exports = {
  createExtensionAdapter: fn => (ctx, req) => {
    fn(req.body, ctpResponse(ctx), ctx.log);
  },
};

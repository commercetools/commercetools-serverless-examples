// Azure

const createReject = ctx => error => {
  const errorArray = Array.isArray(error) ? error : [error];
  ctx.res = {
    status: 400,
    body: {
      errors: [errorArray],
    },
  };
  ctx.done();
};

const createAccept = ctx => (update = []) => {
  const actionsArray = Array.isArray(update) ? update : [update];
  ctx.res = {
    status: 200,
    body: {
      actions: actionsArray,
    },
  };
  ctx.done();
};

const ctpResponse = ctx => ({
  reject: createReject(ctx),
  accept: createAccept(ctx),
});

module.exports = {
  ctpExtensionAdapter(fn) {
    return (ctx, req) => {
      fn(req.body, ctpResponse(ctx), ctx.log);
    };
  },
};

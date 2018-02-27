// Azure

module.exports = {
  ctpExtensionAdapter: function(fn) {
    return function(context, req) {
      fn(req.body, ctpResponse(context), context.log);
    }
  }
}

function ctpResponse(context) {
  return {
    reject: createReject(context),
    accept: createAccept(context),
  }
}

const createReject = context => (error) => {
  var errorArray = Array.isArray(error) ? error : [error]
  context.res = {
    status: 400,
    body : {
      errors : [errorArray]
    }
  };
  context.done();
}

const createAccept = context => (update = []) => {
  var actionsArray = Array.isArray(update) ? update : [update]
  context.res = {
    status: 200,
    body : {
      actions : actionsArray
    }
  };
  context.done();
}


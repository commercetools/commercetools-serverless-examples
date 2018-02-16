// Azure

module.exports = {
  ctpAzureWrapper: function(fn) {
    return function(context, req) {
      fn(req.body, ctpAzureResponse(context), context.log);
    }
  }
}

function ctpAzureResponse(context) {
  return {
    pass: passAzure(context),
    errors: errorsAzure(context),
    error: errorAzure(context),
    updates: updatesAzure(context),
    update: updateAzure(context),
  }
}

function passAzure(context) {
  return function() {
    context.res = {
      status: 200,
      body: undefined
    };
    context.done();
  }
}

function errorsAzure(context) {
  return function(errors) {
    context.res = {
      status: 400,
      body : {
        errors : errors
      }
    };
    context.done();
  }
}

function errorAzure(context) {
  return function(error) {
    context.res = {
      status: 400,
      body : {
        errors : [error]
      }
    };
    context.done();
  }
}

function updatesAzure(context) {
  return function(updateActions) {
    context.res = {
      status: 200,
      body : {
        actions : updateActions
      }
    };
    context.done();
  }
}

function updateAzure(context) {
  return function(updateAction) {
    context.res = {
      status: 200,
      body : {
        actions : [updateAction]
      }
    };
    context.done();
  }
}

// Google Cloud Functions

module.exports = {
  ctpExtensionAdapter: function(fn) {
    return function(req, res) {
      fn(req.body, ctpGcfResponse(res), console.log);
    }
  }
}

function ctpGcfResponse(res) {
  return {
    pass: passGcf(res),
    errors: errorsGcf(res),
    error: errorGcf(res),
    updates: updatesGcf(res),
    update: updateGcf(res),
  }
}

function passGcf(res) {
  return function() {
    res.status(200).end();
  }
}

function errorsGcf(res) {
  return function(errors) {
    res.status(400).json({
      errors : errors
    });
  }
}

function errorGcf(res) {
  return function(error) {
    res.status(400).json({
      errors : [error]
    });
  }
}

function updatesGcf(res) {
  return function(updateActions) {
    res.status(200).json({
      actions : updateActions
    });
  }
}

function updateGcf(res) {
  return function(updateAction) {
    res.status(200).json({
      actions : [updateAction]
    });
  }
}

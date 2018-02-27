/**
 * Responds to any HTTP request that can provide a "sku" field in the body.
 *
 * @param {!Object} req Cloud Function request context.
 * @param {!Object} res Cloud Function response context.
 */
exports.helloWorld = function helloWorld(req, res) {
  // Example input: {"sku": "cool-product-123"}
  if (req.body.sku === undefined) {
    // This is an error case, as "sku" is required.
    res.status(400).send('No sku defined!');
  } else {
    // Everything is okay.
    console.log(req.body.sku);
    res.status(200).send('Inventory: ' + parseInt(Math.random() * 1000));
  }
};

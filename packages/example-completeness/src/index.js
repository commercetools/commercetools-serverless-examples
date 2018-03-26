const _ = require('lodash');
const CompletenessCalculator = require('./completenessCalculator');
const completeProduct = require('../config/completeProduct.json');
const incompleteProduct = require('../config/incompleteProduct.json');
const schemas = require('./schemas.js').schemas;

const localTest = false;

/**
 * HTTP Cloud Function.
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
exports.diff = function diff(req, res) {
  if (req.body.resource.typeId === 'product' && req.body.resource.obj) {
    const cc = new CompletenessCalculator(
      completeProduct.masterData.staged,
      incompleteProduct.masterData.staged,
      schemas
    );
    const result = cc.getMissingValues(req.body.resource.obj.masterData.staged);
    const actions = [];

    _.forOwn(result.completeness, (value, key) => {
      actions.push({
        action: 'setAttribute',
        variantId: parseInt(key, 10),
        name: 'completeness',
        value,
      });
    });

    _.forOwn(result.missingValues, (value, key) => {
      actions.push({
        action: 'setAttribute',
        variantId: parseInt(key, 10),
        name: 'missingvalues',
        value,
      });
    });

    if (result) {
      if (localTest) {
        console.log(actions);
      } else {
        res.status(200).json({
          actions,
        });
      }
    } else {
      res.send(200).end();
    }
  } else {
    res.send(200).end();
    // eslint-disable-next-line no-console
    console.log('Error: Request payload does not contain a valid product');
  }
};

// For simplified local testing...
/* eslint-disable */
if (localTest) {
  exports.diff({
    body: {
      resource: {
        typeId: 'product',
        obj: require('../test/resources/product.json'),
      },
    },
  });
}
/* eslint-enable */

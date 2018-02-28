const utils = require('./utils');

const incompleteProduct = JSON.stringify(
  require('../config/incompleteProduct.json')
);
const completeProduct = JSON.stringify(
  require('../config/completeProduct.json')
);

/**
 * HTTP Cloud Function.
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
exports.diff = function diff(req, res) {
  if (req.body.resource.typeId === 'product' && req.body.resource.obj) {
    const product = JSON.stringify(req.body.resource.obj);
    if (product) {
      const localizations = utils.getRequiredLocalizations(
        JSON.parse(completeProduct)
      );

      const requiredValues = {};
      const missingValues = {};
      const completeness = {};

      localizations.forEach(localization => {
        const incompleteProductLocalized = utils.normalize(
          JSON.parse(incompleteProduct),
          localization
        );
        const completeProductLocalized = utils.normalize(
          JSON.parse(completeProduct),
          localization
        );
        const productLocalized = utils.normalize(
          JSON.parse(product),
          localization
        );

        requiredValues[localization] = utils.productDiff(
          completeProductLocalized,
          incompleteProductLocalized
        );
        missingValues[localization] = utils.productDiff(
          completeProductLocalized,
          productLocalized,
          localizations
        );

        if (requiredValues[localization].length > 0) {
          completeness[localization] = String(
            Math.round(
              100 -
                100 /
                  requiredValues[localization].length *
                  missingValues[localization].length
            )
          );
          missingValues[localization] = JSON.stringify(
            missingValues[localization]
          );
        } else if (requiredValues[localization].length < 1) {
          completeness[localization] = 'Error: Division by zero';
          console.log(
            "Error: Your config files don't define any different properties for incomplete and complete products"
          );
        }
      });

      res.status(200).json({
        actions: [
          {
            action: 'setAttributeInAllVariants',
            name: 'completeness',
            value: completeness,
          },
          {
            action: 'setAttributeInAllVariants',
            name: 'missingvalues',
            value: missingValues,
          },
        ],
      });
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
// exports.diff({body: {resource: {typeId: 'product', obj: require('./test/resources/product.json')}}});
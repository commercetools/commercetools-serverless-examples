const { diff } = require('deep-diff');
const _ = require('lodash');
const jp = require('jsonpath');
const schemas = require('./schemas.js').schemas;

exports.getRequiredLocalizations = product => {
  const localizations = [];
  _.forOwn(schemas, schema => {
    _.forEach(schema.path, path => {
      schema.normalizer
        .getLocalizations(product, path)
        .forEach(localization => {
          localizations.push(localization);
        });
    });
  });
  return _.uniq(localizations);
};

exports.normalize = (product, localization) => {
  // eslint-disable-next-line
  delete product.masterData.current;
  _.forOwn(schemas, schema => {
    // eslint-disable-next-line
    schema.localization = localization;
    _.forEach(schema.path, path => {
      jp.apply(product, path, schema.normalizer.normalize.bind(schema));
    });
  });
  return product;
};

/**
 * Compare to product drafts and return a list of JSONpaths for all properties and array elements that are missing on the right side
 * @param completeProduct
 * @param product
 * @returns {Array.<T>|string|Array|*}
 */
exports.productDiff = (completeProduct, product) => {
  const differences = diff(completeProduct, product);
  // Find missing object properties
  const missingValues = _.filter(differences, { kind: 'D' });
  const missingValuePaths = _.map(missingValues, missingValue =>
    missingValue.path.join('.')
  );
  // Find missing array elements
  const missingArrayElements = _.filter(differences, {
    kind: 'A',
    item: { kind: 'D' },
  });
  const missingArrayPaths = _.map(missingArrayElements, missingArrayElement => {
    let path = missingArrayElement.path.join('.');
    if (typeof missingArrayElement.item.lhs === 'string') {
      path += `[${missingArrayElement.item.lhs}]`;
    }
    return path;
  });
  const missingPaths = missingValuePaths.concat(missingArrayPaths);
  return missingPaths;
};

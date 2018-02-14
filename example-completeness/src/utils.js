import { diff } from 'deep-diff';
import _ from 'lodash';
import jp from 'jsonpath';

const schemas = require('./schemas.js').schemas;

exports.getRequiredLocalizations = function (product) {
    var localizations = [];
    _.forOwn(schemas, function(schema){
        schema.normalizer.getLocalizations(product, schema.path).forEach(function(localization){
            localizations.push(localization);
        })
    });
    return _.uniq(localizations);
};


exports.normalize = function (product, localization) {
    delete product.masterData.current;
    _.forOwn(schemas, function (schema) {
        schema.localization = localization;
        jp.apply(product, schema.path, schema.normalizer.normalize.bind(schema));
    });
    return product;
}

/**
 * Compare to product drafts and return a list of JSONpaths for all properties and array elements that are missing on the right side
 * @param completeProduct
 * @param product
 * @returns {Array.<T>|string|Array|*}
 */
exports.productDiff = function (completeProduct, product) {
    const differences = diff(completeProduct, product);
    // Find missing object properties
    const missingValues = _.filter(differences, {kind: 'D'});
    var missingValuePaths = _.map(missingValues, function (missingValue) {
        return missingValue.path.join(".");
    });
    // Find missing array elements
    const missingArrayElements = _.filter(differences, {kind: 'A', item: {kind: 'D'}});
    const missingArrayPaths = _.map(missingArrayElements, function (missingArrayElement) {
        var path = missingArrayElement.path.join(".");
        if (typeof missingArrayElement.item.lhs === "string") {
            path += "[" + missingArrayElement.item.lhs + "]";
        }
        return path;
    });
    var missingPaths = missingValuePaths.concat(missingArrayPaths);
    return missingPaths;
}
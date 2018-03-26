const { diff } = require('deep-diff');
const _ = require('lodash');
const Product = require('./product');

module.exports = class completenessCalculator {
  constructor(completeProduct, incompleteProduct, schemas) {
    this.schemas = schemas;
    this.completeProduct = new Product(completeProduct, schemas);
    this.requiredLocales = this.completeProduct.locales;
    this.incompleteProduct = new Product(
      incompleteProduct,
      schemas,
      this.requiredLocales
    );
    this.product = null;
  }

  getMissingValues(product) {
    const requiredValues = {};
    const missingValues = {};
    const completeness = {};

    this.product = new Product(product, this.schemas, this.requiredLocales);

    this.requiredLocales.forEach(locale => {
      requiredValues[locale] = completenessCalculator._compare(
        this.completeProduct.getNormalizedLocalization(locale),
        this.incompleteProduct.getNormalizedLocalization(locale)
      );

      const normalizedLocalization = this.product.getNormalizedLocalization(
        locale
      );
      normalizedLocalization.variants.forEach(variant => {
        if (!missingValues[variant.id]) {
          missingValues[variant.id] = {};
        }
        if (!completeness[variant.id]) {
          completeness[variant.id] = {};
        }

        const normalizedLocalizationVariant = Product.getNormalizedLocalizationVariant(
          normalizedLocalization,
          variant
        );

        missingValues[variant.id][locale] = completenessCalculator._compare(
          this.completeProduct.getNormalizedLocalization(locale),
          normalizedLocalizationVariant
        );

        completeness[variant.id][
          locale
        ] = completenessCalculator._calculateCompleteness(
          requiredValues[locale],
          missingValues[variant.id][locale]
        );

        missingValues[variant.id][locale] = JSON.stringify(
          missingValues[variant.id][locale]
        );
      });
    });

    return {
      requiredValues,
      missingValues,
      completeness,
    };
  }

  static _calculateCompleteness(required, missing) {
    return String(Math.round(100 - 100 / required.length * missing.length));
  }

  /**
   * Compare to product drafts and return a list of JSONpaths for all properties and array elements that are missing on the right side
   * @param completeProduct
   * @param product
   * @returns {Array.<T>|string|Array|*}
   */
  static _compare(completeProduct, product) {
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
    const missingArrayPaths = _.map(
      missingArrayElements,
      missingArrayElement => {
        let path = missingArrayElement.path.join('.');
        if (typeof missingArrayElement.item.lhs === 'string') {
          path += `[${missingArrayElement.item.lhs}]`;
        }
        return path;
      }
    );
    const missingPaths = missingValuePaths.concat(missingArrayPaths);
    return missingPaths;
  }
};

const _ = require('lodash');
const jp = require('jsonpath');

module.exports = class Product {
  constructor(product, schemas, requiredLocales) {
    this.schemas = schemas;
    this.product = this._flatten(product);
    if (requiredLocales) {
      this.locales = requiredLocales;
    } else {
      this.locales = this._getLocales();
    }
    this.localizations = this._normalize();
  }

  getProduct() {
    return JSON.parse(this.product);
  }

  getNormalizedLocalization(locale) {
    if (this.localizations[locale]) {
      return this.localizations[locale];
    }
    return {};
  }

  _flatten(product) {
    if (product.masterVariant) {
      /* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["product"] }] */
      product.variants.unshift(product.masterVariant);
    }
    delete product.masterVariant;
    this.product = JSON.stringify(product);
    return JSON.stringify(product);
  }

  _getLocales() {
    const locales = [];
    _.forOwn(this.schemas, schema => {
      _.forEach(schema.path, path => {
        schema.normalizer
          .getLocales(this.getProduct(), path)
          .forEach(locale => {
            locales.push(locale);
          });
      });
    });
    return _.uniq(locales);
  }

  _normalize() {
    const localizations = {};
    this.locales.forEach(locale => {
      localizations[locale] = this._createNormalizedLocalization(locale);
    });
    return localizations;
  }

  _createNormalizedLocalization(locale) {
    const product = this.getProduct();
    _.forOwn(this.schemas, schema => {
      // eslint-disable-next-line
      schema.locale = locale;
      _.forEach(schema.path, path => {
        jp.apply(product, path, schema.normalizer.normalize.bind(schema));
      });
    });
    return product;
  }

  static getNormalizedLocalizationVariant(normalizedLocalization, variant) {
    const product = JSON.parse(JSON.stringify(normalizedLocalization));
    product.variants = [variant];
    return product;
  }
};

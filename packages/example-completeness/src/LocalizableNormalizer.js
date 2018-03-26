const _ = require('lodash');
const jp = require('jsonpath');

exports.getLocales = (product, path) => {
  const locales = [];
  const localizable = jp.query(product, path)[0];
  if (_.isObject(product)) {
    locales.push(..._.keys(localizable));
  }
  return locales;
};

exports.normalize = function(object) {
  const locale = this.locale;
  const obj = {};
  if (_.isObject(object) && _.has(object, locale)) {
    obj[locale] = true;
  }
  return obj;
};

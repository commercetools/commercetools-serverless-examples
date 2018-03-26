const _ = require('lodash');
const jp = require('jsonpath');

exports.getLocales = () => [];

exports.normalize = function(object) {
  const self = this;
  if (_.isObject(object)) {
    const normalizedArray = _.map(this.identifiers, identifier => {
      if (self.localizablePath) {
        let objectValues = jp.query(object, self.localizablePath);
        objectValues = objectValues[0];
        if (objectValues[self.locale]) {
          return `@.${identifier}=="${jp.query(object, `$.${identifier}`)}"`;
        }
      } else {
        return `@.${identifier}=="${jp.query(object, `$.${identifier}`)}"`;
      }

      return null;
    });
    const key = normalizedArray.join(' && ');
    return key;
  }
  return null;
};

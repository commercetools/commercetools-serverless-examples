import _ from 'lodash';
import jp from 'jsonpath';

exports.getLocalizations = function(product, path) {
  return [];
};

exports.normalize = function(object) {
  const self = this;
  if (_.isObject(object)) {
    const normalizedArray = _.map(this.identifiers, identifier => {
      if (self.localizablePath) {
        let objectValues = jp.query(object, self.localizablePath);
        objectValues = objectValues[0];
        if (objectValues[self.localization]) {
          return `@.${identifier}=="${jp.query(object, `$.${identifier}`)}"`;
        }
      } else {
        return `@.${identifier}=="${jp.query(object, `$.${identifier}`)}"`;
      }
    });
    const key = normalizedArray.join(' && ');
    return key;
  }
};

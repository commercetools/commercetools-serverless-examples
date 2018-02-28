const _ = require('lodash');
const jp = require('jsonpath');

const attributeTypes = [
  // @TODO: Add nested type
  {
    name: 'set',
    identify: attribute =>
      !!(attribute.value && Array.isArray(attribute.value)),
  },
  {
    name: 'reference',
    identify: attribute =>
      !!(
        typeof attribute.value === 'object' &&
        attribute.value.typeId &&
        (attribute.value.id || attribute.value.key)
      ),
  },
  {
    name: 'localizableEnum',
    identify: attribute =>
      !!(
        attribute.value.label &&
        typeof attribute.value.label === 'object' &&
        attribute.value.key
      ),
    localizablePath: '$.value.label',
  },
  {
    name: 'enum',
    identify: attribute => !!(attribute.value.label && attribute.value.key),
  },
  {
    name: 'localizableText',
    identify: attribute => !!(typeof attribute.value === 'object'),
    localizablePath: '$.value',
  },
  {
    name: 'simple',
    identify() {
      return true;
    },
  },
];

exports.getAttributeType = attribute => {
  if (typeof attribute === 'object') {
    for (let i = 0; i < attributeTypes.length; i += 1) {
      if (attributeTypes[i].identify(attribute)) {
        return attributeTypes[i];
      }
    }
  }
  return false;
};

exports.getLocalizations = (product, path) => {
  const localizations = [];
  jp.query(product, path).forEach(attribute => {
    const attributeType = exports.getAttributeType(attribute);
    if (
      attributeType.localizablePath &&
      jp.query(attribute, attributeType.localizablePath)[0]
    ) {
      localizations.push(
        ..._.keys(jp.query(attribute, attributeType.localizablePath)[0])
      );
    }
  });
  return _.uniq(localizations);
};

exports.normalize = attribute => {
  const self = this;
  const attributeType = exports.getAttributeType(attribute);
  if (attributeType) {
    const normalizedArray = _.map(this.identifiers, identifier => {
      if (attributeType.localizablePath) {
        let objectValues = jp.query(
          attribute,
          exports.getAttributeType(attribute).localizablePath
        );
        objectValues = objectValues[0];
        if (objectValues[self.localization]) {
          return `@.${identifier}=="${jp.query(attribute, `$.${identifier}`)}"`;
        }
      } else {
        return `@.${identifier}=="${jp.query(attribute, `$.${identifier}`)}"`;
      }

      return null;
    });
    const key = `?(${normalizedArray.join(' && ')})`;
    return key;
  }

  return null;
};

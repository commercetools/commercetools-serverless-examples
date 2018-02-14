import _ from 'lodash';
import jp from 'jsonpath';

const attributeTypes = [
    //@TODO: Add nested type
    {
        name: 'set',
        identify: attribute => {
            if (attribute.value && Array.isArray(attribute.value)) {
                return true;
            }
        }
    }, {
        name: 'reference',
        identify: attribute => {
            if (typeof attribute.value === 'object' && attribute.value.typeId && (attribute.value.id || attribute.value.key)) {
                return true;
            }
        }
    }, {
        name: 'localizableEnum',
        identify: attribute => {
            if (attribute.value.label && typeof attribute.value.label === 'object' && attribute.value.key) {
                return true;
            }
        },
        localizablePath: '$.value.label'
    }, {
        name: 'enum',
        identify: attribute => {
            if (attribute.value.label && attribute.value.key) {
                return true;
            }
        }
    }, {
        name: 'localizableText',
        identify: attribute => {
            if (typeof attribute.value === 'object') {
                return true;
            }
        },
        localizablePath: '$.value'
    }, {
        name: 'simple',
        identify: function (attribute) {
            return true;
        }
    }
]


exports.getAttributeType = function (attribute) {
    if (typeof attribute === 'object') {
        for (var i = 0; i < attributeTypes.length; i++) {
            if (attributeTypes[i].identify(attribute)) {
                return attributeTypes[i];
            }
        }
    }
    return false;
}

exports.getLocalizations = function (product, path) {
    var localizations = [];
    jp.query(product, path).forEach(attribute => {
        if (exports.getAttributeType(attribute).localizablePath && jp.query(attribute, exports.getAttributeType(attribute).localizablePath)[0]) {
            Object.keys(jp.query(attribute, exports.getAttributeType(attribute).localizablePath)[0]).forEach(key => {
                localizations.push(key);
            });
        }
    });
    return _.uniq(localizations)
}

exports.normalize = function (attribute) {
    const self = this;
    const attributeType = exports.getAttributeType(attribute);
    if (attributeType) {
        var normalizedArray = _.map(this.identifiers, identifier => {
            if (attributeType.localizablePath) {
                var objectValues = jp.query(attribute, exports.getAttributeType(attribute).localizablePath);
                objectValues = objectValues[0];
                if (objectValues[self.localization]) {
                    return `@.${identifier}=="${jp.query(attribute, `$.${identifier}`)}"`
                }
            } else {
                return `@.${identifier}=="${jp.query(attribute, `$.${identifier}`)}"`
            }
        })
        var key = `?(${normalizedArray.join(" && ")})`;
        return key;
    }
}

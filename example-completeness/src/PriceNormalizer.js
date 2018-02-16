import _ from 'lodash';
import jp from 'jsonpath';

exports.getLocalizations = function (product, path) {
    return [];
}

exports.normalize = function (object) {
    let self = this;
    if (_.isObject(object)) {
        let normalizedArray = _.map(this.identifiers, identifier => {
            if (self.localizablePath) {
                let objectValues = jp.query(object, self.localizablePath);
                objectValues = objectValues[0];
                if (objectValues[self.localization]) {
                    return `@.${identifier}=="${jp.query(object, `$.${identifier}`)}"`
                }
            } else {
                return `@.${identifier}=="${jp.query(object, `$.${identifier}`)}"`
            }
        })
        let key = normalizedArray.join(" && ");
        return key;
    }
}
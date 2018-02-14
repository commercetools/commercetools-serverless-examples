import _ from 'lodash';
import jp from 'jsonpath';

exports.getLocalizations = function (product, path) {
    return [];
}

exports.normalize = function (object) {
    var self = this;
    if (typeof object != "string") {
        var normalizedArray = _.map(this.identifiers, identifier => {
            if (self.localizablePath) {
                var objectValues = jp.query(object, self.localizablePath);
                objectValues = objectValues[0];
                if (objectValues[self.localization]) {
                    return `@.${identifier}=="${jp.query(object, `$.${identifier}`)}"`
                }
            } else {
                return `@.${identifier}=="${jp.query(object, `$.${identifier}`)}"`
            }
        })
        var key = normalizedArray.join(" && ");
        return key;
    }
}
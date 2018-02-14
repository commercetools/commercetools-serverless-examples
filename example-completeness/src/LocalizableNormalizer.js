import _ from 'lodash';
import jp from 'jsonpath';

exports.getLocalizations = function (product, path) {
    var localizations = [];
    const localizable = jp.query(product, path)[0];
    if (typeof localizable === 'object') {
        Object.keys(localizable).forEach(key => {
            localizations.push(key);
        });
    }
    return _.uniq(localizations)
}

exports.normalize = function (object) {
    const localization = this.localization;
    var obj = {};
    if (typeof object != "string") {
        if (typeof object === 'object' && object[localization]) {
            obj[localization] = true;
        }
    }
    return obj;
}
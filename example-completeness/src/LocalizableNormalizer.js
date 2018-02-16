import _ from 'lodash';
import jp from 'jsonpath';

exports.getLocalizations = function (product, path) {
    let localizations = [];
    const localizable = jp.query(product, path)[0];
    if (_.isObject(product)) {
        localizations.push(..._.keys(localizable));
    }
    return localizations;
}

exports.normalize = function (object) {
    const localization = this.localization;
    let obj = {};
    if (_.isObject(object) && _.has(object, localization)) {
        obj[localization] = true;
    }
    return obj;
}
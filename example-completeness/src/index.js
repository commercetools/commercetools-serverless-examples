import utils from './utils'


const incompleteProduct = JSON.stringify(require('./config/incompleteProduct.json'));
const completeProduct = JSON.stringify(require('./config/completeProduct.json'));

/**
 * HTTP Cloud Function.
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
exports.diff = function diff(req, res) {
    if (req.body.resource.typeId == 'product' && req.body.resource.obj) {
        const product = JSON.stringify(req.body.resource.obj);
        if (product) {
            const localizations = utils.getRequiredLocalizations(JSON.parse(completeProduct));
            console.log("Required localizations: " + localizations.toString());

            let requiredValues = {};
            let missingValues = {};
            let completeness = {};

            localizations.forEach(localization => {
                const incompleteProductLocalized = utils.normalize(JSON.parse(incompleteProduct), localization);
                const completeProductLocalized = utils.normalize(JSON.parse(completeProduct), localization);
                const productLocalized = utils.normalize(JSON.parse(product), localization);

                requiredValues[localization] = utils.productDiff(completeProductLocalized, incompleteProductLocalized);
                missingValues[localization] = utils.productDiff(completeProductLocalized, productLocalized, localizations);

                if (requiredValues[localization].length > 0) {
                    completeness[localization] = Math.round(100 - ((100 / requiredValues[localization].length) * missingValues[localization].length));
                } else if (requiredValues[localization].length < 1) {
                    // Error: "Your config files don't define any different properties for incomplete and complete products"
                }
            })

            res.status(200).json({
                    actions: [{
                        action: "setAttributeInAllVariants",
                        name: "completeness",
                        value: completeness
                    },
                        {
                            action: "setAttributeInAllVariants",
                            name: "missingvalues",
                            value: missingValues
                        }]
                }
            )
        } else {
            res.send(200).end();
        }
    }else{
        // Error: "Request payload does not contain a valid product"
    }
}

//For simplified local testing...
//exports.diff({body: {resource: { obj: require('./test/resources/product.json')}}});

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
    const product = JSON.stringify(req.body.resource.obj);
    if (product) {
        const localizations = utils.getRequiredLocalizations(JSON.parse(completeProduct));
        console.log("Required localizations: " + localizations.toString());

        var missingValuesAll = {};
        var completenessAll = {};

        localizations.forEach(localization => {
            const incompleteProductLocalized = utils.normalize(JSON.parse(incompleteProduct), localization);
            const completeProductLocalized = utils.normalize(JSON.parse(completeProduct), localization);
            const productLocalized = utils.normalize(JSON.parse(product), localization);

            const allMissingValues = utils.productDiff(completeProductLocalized, incompleteProductLocalized);
            var missingValues = utils.productDiff(completeProductLocalized, productLocalized, localizations);
            const completeness = Math.round(100 - (100 / allMissingValues.length * missingValues.length));
            missingValues = missingValues.join('\n');

            completenessAll[localization] = String(completeness);
            missingValuesAll[localization] = missingValues;
        })

        console.log(completenessAll);
        console.log(missingValuesAll);

        res.status(200).json({
                actions: [{
                    action: "setAttributeInAllVariants",
                    name: "completeness",
                    value: completenessAll
                },
                    {
                        action: "setAttributeInAllVariants",
                        name: "missingvalues",
                        value: missingValuesAll
                    }]
            }
        )
    } else {
        res.send(200).end();
    }
}

//For simplified local testing...
//exports.diff({body: {resource: { obj: require('./test/resources/product.json')}}});

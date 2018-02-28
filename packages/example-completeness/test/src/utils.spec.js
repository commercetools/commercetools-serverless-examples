const utils = require('../../src/utils');
const completeProduct = require('../resources/completeProduct.json');
const incompleteProduct = require('../resources/incompleteProduct.json');
const normalizedCompleteProduct = require('../resources/normalizedCompleteProduct.json');

describe('Utils', () => {
  it('should return the required localizations', () => {
    const localizations = utils.getRequiredLocalizations(completeProduct);
    expect(localizations).toHaveLength(2);
  });

  it('should normalize a product as required', () => {
    const normalizedProduct = utils.normalize(completeProduct, 'de');
    expect(normalizedProduct).toEqual(normalizedCompleteProduct);
  });

  it('it should identify all required missing values for a localization', () => {
    const completeProductLocalized = utils.normalize(completeProduct, 'de');
    const incompleteProductLocalized = utils.normalize(incompleteProduct, 'de');
    const allMissingValues = utils.productDiff(
      completeProductLocalized,
      incompleteProductLocalized
    );
    expect(allMissingValues).toHaveLength(21);
  });
});

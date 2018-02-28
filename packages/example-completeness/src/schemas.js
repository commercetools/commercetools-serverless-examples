const PriceNormalizer = require('./PriceNormalizer');
const AttributeNormalizer = require('./AttributeNormalizer');
const LocalizableNormalizer = require('./LocalizableNormalizer');

exports.schemas = {
  attributes: {
    path: [
      '$.masterData.staged.masterVariant.attributes.*',
      '$.masterData.staged.variants[*].attributes.*',
    ],
    identifiers: ['name'],
    localizablePath: '$.value',
    normalizer: AttributeNormalizer,
  },
  prices: {
    path: ['$.masterData.staged.masterVariant.prices.*'],
    identifiers: ['country', 'channel.id', 'value.currencyCode'],
    normalizer: PriceNormalizer,
  },
  localizables: {
    path: [
      '$.masterData.staged.name',
      '$.masterData.staged.description',
      '$.masterData.staged.slug',
      '$.masterData.staged.searchKeywords',
      '$.masterData.staged.metaTitle',
      '$.masterData.staged.metaDescription',
      '$.masterData.staged.metaKeywords',
    ],
    normalizer: LocalizableNormalizer,
  },
};

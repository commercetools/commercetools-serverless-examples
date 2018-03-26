const PriceNormalizer = require('./PriceNormalizer');
const AttributeNormalizer = require('./AttributeNormalizer');
const LocalizableNormalizer = require('./LocalizableNormalizer');

exports.schemas = {
  attributes: {
    path: ['$.variants[*].attributes.*'],
    identifiers: ['name'],
    localizablePath: '$.value',
    normalizer: AttributeNormalizer,
  },
  prices: {
    path: ['$.variants[*].prices.*'],
    identifiers: ['country', 'channel.id', 'value.currencyCode'],
    normalizer: PriceNormalizer,
  },
  localizables: {
    path: [
      '$.name',
      '$.description',
      '$.slug',
      '$.searchKeywords',
      '$.metaTitle',
      '$.metaDescription',
      '$.metaKeywords',
    ],
    normalizer: LocalizableNormalizer,
  },
};

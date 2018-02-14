import PriceNormalizer from './PriceNormalizer'
import AttributeNormalizer from './AttributeNormalizer'
import LocalizableNormalizer from './LocalizableNormalizer'

exports.schemas = {
    attributes: {
        path: '$.masterData.staged.masterVariant.attributes.*',
        identifiers: ['name'],
        localizablePath: '$.value',
        normalizer: AttributeNormalizer
    },
    prices: {
        path: '$.masterData.staged.masterVariant.prices.*',
        identifiers: ['country', 'channel.id', 'value.currencyCode'],
        normalizer: PriceNormalizer
    },
    name: {
        path: '$.masterData.staged.name',
        normalizer: LocalizableNormalizer
    },
    description: {
        path: '$.masterData.staged.description',
        normalizer: LocalizableNormalizer
    },
    slug: {
        path: '$.masterData.staged.slug',
        normalizer: LocalizableNormalizer
    },
    searchKeywords: {
        path: '$.masterData.staged.searchKeywords',
        normalizer: LocalizableNormalizer
    },
    metaTitle: {
        path: '$.masterData.staged.metaTitle',
        normalizer: LocalizableNormalizer
    },
    metaDescription: {
        path: '$.masterData.staged.metaDescription',
        normalizer: LocalizableNormalizer
    },
    metaKeywords: {
        path: '$.masterData.staged.metaKeywords',
        normalizer: LocalizableNormalizer
    }
}

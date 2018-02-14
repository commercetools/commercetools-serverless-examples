import PriceNormalizer from '../../PriceNormalizer'

import {expect} from 'chai';

describe('PriceNormalizer', () => {

    it('it should return the correct JSONpath for a price', () => {
        const price = {
            "value": {
                "currencyCode": "EUR",
                "centAmount": 10000
            },
            "id": "4e83bc7c-f80d-4da7-8252-b7da30affc93",
            "country": "DE",
            "channel": {
                "typeId": "channel",
                "id": "6e55c807-aeae-492c-97a1-b8724f013e20"
            }
        }
        const config = {
            path: '$.masterData.staged.masterVariant.prices.*',
            identifiers: ['country', 'channel.id', 'value.currencyCode']
        };
        const jsonpath = PriceNormalizer.normalize.bind(config)(price);
        expect(jsonpath).to.equal('@.country=="DE" && @.channel.id=="6e55c807-aeae-492c-97a1-b8724f013e20" && @.value.currencyCode=="EUR"');
    })

})

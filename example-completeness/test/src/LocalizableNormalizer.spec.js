import LocalizableNormalizer from '../../LocalizableNormalizer'

import {expect} from 'chai';

describe('LocalizableNormalizer', () => {

    it('should return the correct JSONpath for a description', () => {
        const description = {
                "en": "Complete EN",
                "de": "Complete DE"
            }
        const config = {
            localization: 'de'
        };
        const jsonpath = LocalizableNormalizer.normalize.bind(config)(description);
        expect(jsonpath.de).to.be.true;
    })

})

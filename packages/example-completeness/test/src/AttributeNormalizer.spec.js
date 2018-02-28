const AttributeNormalizer = require('../../src/AttributeNormalizer');
const completeProduct = require('../resources/completeProduct.json');

describe('AttributeNormalizer', () => {
  it('should identify required locales based on the given product', () => {
    const localizations = AttributeNormalizer.getLocalizations(
      completeProduct,
      '$.masterData.staged.masterVariant.attributes.*'
    );
    expect(localizations).toHaveLength(2);
  });

  it('it should identify attribute type Set', () => {
    const attribute = {
      name: 'setoftext',
      value: ['2', '1'],
    };
    const attributeType = AttributeNormalizer.getAttributeType(attribute);
    expect(attributeType.name).toEqual('set');
  });

  it('should identify attribute type Reference', () => {
    const attribute = {
      name: 'referenceproduct',
      value: {
        id: 'de642648-8a9e-4d84-a79e-ebe190e1c2bc',
        typeId: 'product',
      },
    };
    const attributeType = AttributeNormalizer.getAttributeType(attribute);
    expect(attributeType.name).toEqual('reference');
  });

  it('should identify attribute type localizableEnum', () => {
    const attribute = {
      name: 'lenum',
      value: {
        label: {
          de: 'a',
          en: 'a',
        },
        key: 'a',
      },
    };
    const attributeType = AttributeNormalizer.getAttributeType(attribute);
    expect(attributeType.name).toEqual('localizableEnum');
  });

  it('should identify attribute type Enum', () => {
    const attribute = {
      name: 'enum',
      value: {
        label: 'a',
        key: 'a',
      },
    };
    const attributeType = AttributeNormalizer.getAttributeType(attribute);
    expect(attributeType.name).toEqual('enum');
  });

  it('should identify attribute type localizableText', () => {
    const attribute = {
      name: 'ltext',
      value: {
        de: '2',
        en: '1',
      },
    };
    const attributeType = AttributeNormalizer.getAttributeType(attribute);
    expect(attributeType.name).toEqual('localizableText');
  });

  it('should identify attribute type Simple', () => {
    const attribute = {
      name: 'test3',
      value: '1',
    };
    const attributeType = AttributeNormalizer.getAttributeType(attribute);
    expect(attributeType.name).toEqual('simple');
  });

  it('should return the correct JSONpath for an attribute', () => {
    const attribute = {
      name: 'test3',
      value: '1',
    };
    const config = {
      path: '$.masterData.staged.masterVariant.attributes.*',
      identifiers: ['name'],
      localizablePath: '$.value',
    };
    const jsonpath = AttributeNormalizer.normalize.bind(config)(attribute);
    expect(jsonpath).toEqual('?(@.name=="test3")');
  });
});

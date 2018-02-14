# Completeness example
[API-Extension](https://docs.commercetools.com/http-api-projects-api-extensions.html) for the commercetools platform to synchronously identify missing values and calculate language specific completeness of a product whenever the product is created or updated.

### Use case
A common requirement in PIM (product information management) projects is to manage product states based on specific properties of a product. For example you might want to automatically set a product's state to "Ready for approval" as soon as all required datafields (e.g. name, description, slug, ...) and properties (e.g. images, category-assignments, references, ...) are set and the product is *complete*.

A good approach to achieve this behaviour is to identify missing values of a product whenever it is created or updated by comparing it with a template of a product that is concidered to be complete. Based on the number of missing values you can then calculate a numeric value *completeness* that indicates which percentage of required values is already set.
- completeness[de-DE]: 0% -> No required value for the locale de-DE is set.
- completeness[de-DE]: 100% -> All required values for the locale de-DE are set, the product is complete for this locale.

The completeness value can then be used to trigger state changes or other updates on the product.

## Preconditions
To store completeness information and missing values, the API-Extension requires your productType to have the following two attributes:
```
    {
      "name": "completeness",
      "label": {
        "en": "Completeness",
        "de": "Completeness"
      },
      "isRequired": false,
      "type": {
        "name": "ltext"
      },
      "attributeConstraint": "SameForAll",
      "isSearchable": false,
    },
    {
      "name": "missingvalues",
      "label": {
        "en": "Missing values",
        "de": "Missing values"
      },
      "isRequired": false,
      "type": {
        "name": "ltext"
      },
      "attributeConstraint": "SameForAll",
      "isSearchable": false,
    }
```

## Usage
1. Define a incomplete product (completeness = 0%) by pasting the JSON of a commercetools product into `./config/incompleteProduct.json`
2. Define a complete product (completeness = 100%) by pasting the JSON of a commercetools product into `./config/completeProduct.json`
3. If necessary, define the the level of detail that your product requires and the algorithms that are used to compare products properties by adding schemas to `./src/schemas.js` and write your custom normalizers. More details can be found in the *schemas-section*.
4. Build your code and deploy it as a Google Cloud Function to Google Cloud.
5. Create the [API-Extension](https://docs.commercetools.com/http-api-projects-api-extensions.html) in your commercetools project.

### Schemas
Commercetools products contain many different complex sub-objects such as attributes, images, assets, category-maps, variants, prices and so on. By default `deepdiff` does return all deleted properties and array elements of the given product. While this works fine for simple properties such as `key` or `taxCategory`, more complex properties such as localizable datafields, attributes or prices need to be normalized with *Normalizers* in order to make `deepdiff` return proper values. Schemas and Normalizers help you to define required sub-objects and required properties using JSONpaths. Some examples:

1. Identify a missing product description for a locale using the LocalizationNormalizer:

    **Structure in the product:**
    ```
      "description": {
        "en": "Complete EN",
        "de": "Complete DE"
      }
    ```

    **Corresponding schema:**
    ```
    description: {
        path: '$.masterData.staged.description',
        normalizer: LocalizableNormalizer
    }
    ```
2. Identify a missing localization of an attribute by its name using the AttributeNormalizer:

    **Structure in the product:**
    ```
      {
        "name": "test3",
        "value": "1"
      }
    ```

    **Corresponding schema:**
    ```
    attributes: {
        path: '$.masterData.staged.masterVariant.attributes.*',
        identifiers: ['name'],
        localizablePath: '$.value',
        normalizer: AttributeNormalizer
    }
    ```

3. Identify a missing price without caring about currency, country or channel using the AttributeNormalizer:

    **Structure in the product:**
    ```
      {
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
    ```

    **Corresponding schema:**
    ```
    prices: {
        path: '$.masterData.staged.masterVariant.prices.*',
        identifiers: [],
        normalizer: PriceNormalizer
    }
    ```

4. Identify a missing price by taking into account currency, country or channel using the AttributeNormalizer:

    **Structure in the product:**
    ```
      {
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
    ```

    **Corresponding schema:**
    ```
    prices: {
        path: '$.masterData.staged.masterVariant.prices.*',
        identifiers: ['country', 'channel.id', 'value.currencyCode'],
        normalizer: PriceNormalizer
    }
    ```


## License
Copyright (c) 2018 commercetools

Licensed under the [MIT license](LICENSE-MIT).

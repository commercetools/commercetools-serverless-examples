const { createExtensionAdapter } = require('./ctp-extension-azure-adapters.js');

// var adapter = require('./ctp-extension-gcf-adapter.js');
// exports.handler = adapter.ctpExtensionAdapter(addInsurance);

const addInsurance = (request, ctpResponse, log) => {
  // Use an ID from your project!
  const taxCategoryId = 'af6532f2-2f74-4e0d-867f-cc9f6d0b7c5a';

  const cart = request.resource.obj;
  // If the cart contains any line item that is worth more than $500,
  // mandatory insurance needs to be added.
  const cartRequiresInsurance = cart.lineItems.some(
    lineItem => lineItem.totalPrice.centAmount > 50000
  );
  const insuranceItem = cart.customLineItems.find(
    customLineItem => customLineItem.slug === 'mandatory-insurance'
  );
  const cartHasInsurance = insuranceItem !== undefined;

  if (cartRequiresInsurance && !cartHasInsurance) {
    log('adding insurance');
    ctpResponse.accept([
      {
        action: 'addCustomLineItem',
        name: { en: 'Mandatory Insurance for Items above $500' },
        money: {
          currencyCode: cart.totalPrice.currencyCode,
          centAmount: 1000,
        },
        slug: 'mandatory-insurance',
        taxCategory: {
          typeId: 'tax-category',
          id: taxCategoryId,
        },
      },
    ]);
  } else if (!cartRequiresInsurance && cartHasInsurance) {
    log('removing insurance');
    ctpResponse.accept({
      action: 'removeCustomLineItem',
      customLineItemId: insuranceItem.id,
    });
  } else {
    log('nothing to do');
    ctpResponse.accept();
  }
};

module.exports = createExtensionAdapter(addInsurance);

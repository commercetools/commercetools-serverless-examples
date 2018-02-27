var adapter = require('./ctp-extension-azure-adapter.js');
module.exports = adapter.ctpExtensionAdapter(addInsurance);

// var adapter = require('./ctp-extension-gcf-adapter.js');
// exports.handler = adapter.ctpExtensionAdapter(addInsurance);

function addInsurance(input, ctpResponse, log) {
  // Use an ID from your project!
  var taxCategoryId = "af6532f2-2f74-4e0d-867f-cc9f6d0b7c5a";

  var cart = input.resource.obj;
  // If the cart contains any line item that is worth more than $500,
  // mandatory insurance needs to be added.
  var cartRequiresInsurance = cart.lineItems.some(lineItem =>
    lineItem.totalPrice.centAmount > 50000
  );
  var insuranceItem = cart.customLineItems.find( (customLineItem) => {
    return customLineItem.slug == "mandatory-insurance";
  });
  var cartHasInsurance = insuranceItem != undefined
  
  if (cartRequiresInsurance && !cartHasInsurance) {
    log("adding insurance");
    ctpResponse.accept([{
      action: "addCustomLineItem",
      name: { en: "Mandatory Insurance for Items above $500" },
      money: {
        currencyCode: cart.totalPrice.currencyCode,
        centAmount: 1000
      },
      slug: "mandatory-insurance",
      taxCategory: {
        typeId: "tax-category",
        id: taxCategoryId
      }
    }]);
  }
  else if (!cartRequiresInsurance && cartHasInsurance) {
    log("removing insurance");
    ctpResponse.accept({
      action: "removeCustomLineItem",
      customLineItemId: insuranceItem.id
    });
  }
  else {
    log("nothing to do");
    ctpResponse.accept();
  }
};


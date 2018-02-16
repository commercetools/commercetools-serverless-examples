// var wrapper = require('./ctpAzureWrapper.js');
// module.exports = wrapper.ctpAzureWrapper(addInsurance);

var wrapper = require('./ctpGcfWrapper.js');
exports.handler = wrapper.ctpGcfWrapper(addInsurance);

function addInsurance(input, ctpResponse, log) {
  // Use an ID from your project!
  var taxCategoryId = "af6532f2-2f74-4e0d-867f-cc9f6d0b7c5a";

  var cart = input.resource.obj;
  // If the cart contains any line item that is worth more than $500,
  // mandatory insurance needs to be added.
  var itemRequiresInsurance = cart.lineItems.find( (lineItem) => {
      return lineItem.totalPrice.centAmount > 50000;
  });
  var insuranceItem = cart.customLineItems.find( (customLineItem) => {
      return customLineItem.slug == "mandatory-insurance";
  });

  var cartRequiresInsurance = itemRequiresInsurance != undefined;
  var cartHasInsurance = insuranceItem != undefined

  
  if (cartRequiresInsurance && !cartHasInsurance) {
    log("adding insurance");
    ctpResponse.updates([{
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
    ctpResponse.update({
      action: "removeCustomLineItem",
      customLineItemId: insuranceItem.id
    });
  }
  else {
    log("nothing to do");
    ctpResponse.pass();
  }
};


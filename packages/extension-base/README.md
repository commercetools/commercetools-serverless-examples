# Wrapper around FaaS as common base for API Extensions

Problem: We want to write examples once, but our customers want to run them on AWS Lambda, Azure Functions, or Google Cloud Functions.
Solution: Put a small wrapper between the specific APIs offered by the FaaS providers and our examples.

To implement an extension, you create a function that takes three parameters:

* `input` - This JSON: https://docs.commercetools.com/http-api-projects-api-extensions.html#input
* `ctpResponse` - An object that defines helpers for all possible responses defined here: https://docs.commercetools.com/http-api-projects-api-extensions.html#response It contains the helper functions `pass`, `update`, `updates`, `error`, `errors` that you need to use to make your Extension respond back to ctp.
* `log` - Because it would have been too easy if all FaaS would just use `console.log` ;)

# Installation per cloud provider

First, check that `index.js` requires the addapter for your cloud provider (it may be commented out).

* For AWS Lambda, `upload index.js` and `ctp-extension-lambda-adapters.js`
* For Azure, upload `index.js`, `ctp-extension-azure-adapters.js` and `function.json`
* For GCF, upload `index.js`, `ctp-extension-gcf-adapters.js` and `package.json`

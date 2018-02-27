# Request For Comments: Wrapper around FaaS as common base for API Extensions

Problem: We want to write examples once, but our customers may want to run them on AWS Lambda, Azure Functions, or Google Cloud Functions.
Solution: Put a small wrapper between the specific APIs offered by the FaaS providers and our examples.

To implement an extension, you create a function that takes three parameters:

* `input` - This JSON: https://docs.commercetools.com/http-api-projects-api-extensions.html#input
* `ctpResponse` - An object that defines helpers for all possible responses defined here: https://docs.commercetools.com/http-api-projects-api-extensions.html#response It contains the helper functions `pass`, `update`, `updates`, `error`, `errors` that you need to use to make your Extension respond back to ctp.
* `log` - Because it would have been too easy if all FaaS would just use `console.log` ;)

## State

I have implemented a POC for Azure and GCF. It actually works on both :)

For GCF, upload index.js, ctpGcfWrapper.js and package.json

For Azure, upload index.js (and switch the comments on top of the file), ctpAzureWrapper.js and function.json

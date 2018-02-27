In this example, we're just attempting to get a basic serverless function set up and echo back a random number when a sku is provided

Simply copy and paste the provided index.js and package.json to the Google Cloud Functions editor at https://console.cloud.google.com/functions/add

You may want to set the Trigger to HTTP trigger, and take note of the URL to call your microservice. It will look like https://{region}-{project}.cloudfunctions.net/{function-name}

Once you've created your function, and its been deployed, go ahead and visit the trigger url.

You'll end up at a 404 with the following body: No sku defined!

Now if you supply a sku (via a request body), you'll see a random number returned
If you don't know how to do this, try the following in a terminal:

curl --data "sku=fun-product-123" {triggerurl}

Great! You've just created your first serverless microservice!  Let's hook up commercetools in the next example.

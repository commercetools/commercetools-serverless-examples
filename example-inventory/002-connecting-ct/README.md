In this example we're going to build ontop of the previous example and connect to commercetools.

You can either edit your existing function, or create a new one.

First, you'll need to edit config.json and provide your commercetools client information.

Now that you've modified that file, you can upload the code to google cloud functions.
This time, instead of editing inline, you will need to create a zip file of config.json, index.js and package.json and send it to google cloud functions.

Try running your function with a valid and invalid sku!

// require CT sdk libraries
const createClient = require('@commercetools/sdk-client').createClient;
const createHttpMiddleware = require('@commercetools/sdk-middleware-http')
  .createHttpMiddleware;
const createQueueMiddleware = require('@commercetools/sdk-middleware-queue')
  .createQueueMiddleware;
const createAuthMiddlewareForClientCredentialsFlow = require('@commercetools/sdk-middleware-auth')
  .createAuthMiddlewareForClientCredentialsFlow;
const createRequestBuilder = require('@commercetools/api-request-builder')
  .createRequestBuilder;
const createLoggerMiddleware = require('@commercetools/sdk-middleware-logger')
  .createLoggerMiddleware;

// import config from config.json
const config = require('./config.json');

/**
 * Provides a client to communicate with commercetools.
 */
const createCTClient = () => {
  const client = createClient({
    middlewares: [
      createQueueMiddleware({ concurrency: 10 }),
      createAuthMiddlewareForClientCredentialsFlow({
        host: config.CT_AUTH_HOST,
        projectKey: config.CT_PROJECT_KEY,
        credentials: {
          clientId: config.CT_CLIENT_ID,
          clientSecret: config.CT_CLIENT_SECRET,
        },
        scopes:
          config.CT_SCOPES.indexOf(' ') > 0
            ? config.CT_SCOPES.split(' ')
            : [config.CT_SCOPES],
      }),
      createHttpMiddleware({
        host: config.CT_API_HOST,
      }),
      createLoggerMiddleware(),
    ],
  });
  return client;
};

/**
 * Creates a request builder
 */
const createCTRequestBuilder = () =>
  createRequestBuilder({ projectKey: config.CT_PROJECT_KEY });

/**
 * Responds to any HTTP request that can provide a "sku" field in the body.
 *
 * @param {!Object} req Cloud Function request context.
 * @param {!Object} res Cloud Function response context.
 */
exports.helloWorld = function helloWorld(req, res) {
  // Example input: {"sku": "cool-product-123"}
  if (req.body.sku === undefined) {
    // This is an error case, as "sku" is required.
    res.status(400).send('No sku defined!');
  } else {
    // Everything is okay.
    // Let's attempt to look up the inventory for that sku
    const requestBuilder = createCTRequestBuilder();
    const inventoryUri = requestBuilder.inventory
      .where(`sku="${req.body.sku}"`)
      .build();
    const inventoryRequest = {
      method: 'GET',
      uri: inventoryUri,
    };
    const client = createCTClient();
    client
      .execute(inventoryRequest)
      .then(result => {
        const results = result.body.results;
        if (!results.length) {
          return res
            .status(404)
            .json({ error: 'Inventory for SKU not found!' });
        }

        return res.status(200).json(results);
      })
      .catch(e => {
        // eslint-disable-next-line no-console
        console.error(e);
        res.status(400).json(e);
      });
  }
};

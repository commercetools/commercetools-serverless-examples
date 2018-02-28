const adapters = require('./ctp-extension-azure-adapters');

const createResponse = () => ({ json: jest.fn() });
const createContext = response => ({
  log: jest.fn(),
  done: jest.fn(),
  status: jest.fn(() => response),
});
const createRequest = () => ({
  body: 'foo-body',
});

describe('when creating', () => {
  let fn;
  let context;
  let response;
  let request;

  beforeEach(() => {
    fn = jest.fn();
    request = createRequest();
    response = createResponse();
    context = createContext(response);

    adapters.createExtensionAdapter(fn)(context, request);
  });

  it('should invoke the `fn`', () => {
    expect(fn).toHaveBeenCalled();
  });

  it('should invoke the `fn` with arguments', () => {
    expect(fn).toHaveBeenCalledWith(
      request.body,
      expect.objectContaining({
        accept: expect.any(Function),
        reject: expect.any(Function),
      }),
      context.log
    );
  });

  describe('when accepting', () => {
    const actions = ['foo', 'bar'];

    beforeEach(() => {
      fn.mock.calls[0][1].accept(actions);
    });

    it('should add a `res` to the context', () => {
      expect(context.res).toBeDefined();
    });

    it('should add a `status` `200` to the `res`', () => {
      expect(context.res.status).toBe(200);
    });

    it('should add a `body` with `actions` to the `res`', () => {
      expect(context.res.body).toEqual({
        actions,
      });
    });

    it('should invoke `done` on the context', () => {
      expect(context.done).toHaveBeenCalled();
    });
  });

  describe('when rejecting', () => {
    const errors = ['foo-error'];

    beforeEach(() => {
      fn.mock.calls[0][1].reject(errors);
    });

    it('should add a `res` to the context', () => {
      expect(context.res).toBeDefined();
    });

    it('should add a `status` `400` to the `res`', () => {
      expect(context.res.status).toBe(400);
    });

    it('should add a `body` with `errors` to the `res`', () => {
      expect(context.res.body).toEqual({
        errors,
      });
    });

    it('should invoke `done` on the context', () => {
      expect(context.done).toHaveBeenCalled();
    });
  });
});

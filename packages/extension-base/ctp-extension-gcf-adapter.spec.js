const adapter = require('./ctp-extension-gcf-adapter');

const createResponse = () => ({ json: jest.fn() });
const createContext = response => ({
  log: jest.fn(),
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

    adapter.create(fn)(context, request);
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

    it('should set status to `200`', () => {
      expect(context.status).toHaveBeenCalledWith(200);
    });

    it('should pass actions to response', () => {
      expect(response.json).toHaveBeenCalledWith({ actions });
    });
  });

  describe('when rejecting', () => {
    const errors = ['foo-error'];

    beforeEach(() => {
      fn.mock.calls[0][1].reject(errors);
    });

    it('should set status to `200`', () => {
      expect(context.status).toHaveBeenCalledWith(400);
    });

    it('should pass errors to response', () => {
      expect(response.json).toHaveBeenCalledWith({ errors });
    });
  });
});

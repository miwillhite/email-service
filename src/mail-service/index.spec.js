const { MailService } = require('.');

describe('MailService', () => {
  const params = {};

  describe('with 0 providers', () => {
    it('throws an error', () => {
      expect(() => {
        MailService([]).run(params);
      }).toThrow();
    });
  });

  describe('with 1 provider', () => {
    it('calls the provider with the expect params', () => {
      const provider = {
        send: jest.fn(() => Promise.resolve({}))
      };
      MailService([provider]).run(params);
      expect(provider.send).toHaveBeenCalledWith(params);
    });
  });

  describe('with multiple providers', () => {
    const providerPass = {
      send: jest.fn(() => Promise.resolve({})),
    };
    const providerFail = {
      send: jest.fn(() => Promise.reject()),
    }
    describe('when the first provider call is successful', () => {
      it('returns the result of the first provider and stops', () => {
        const providers = [
          providerPass,
          providerFail,
        ];
        MailService(providers).run(params);
        expect(providerPass.send).toHaveBeenCalledWith(params);
        expect(providerFail.send).not.toHaveBeenCalled();
        // TODO: Test return values
      });
    });

    describe('when the first provider call is unsuccessful', () => {
      it('returns the result of the second provider and stops', () => {
        const providers = [
          // Note: fail first
          providerFail,
          providerPass,
        ];
        MailService(providers).run(params);
        expect(providerPass.send).toHaveBeenCalledWith(params);
        expect(providerFail.send).toHaveBeenCalledWith(params);
        // TODO: Test return values
      });
    });
  });
});
const { expect, assert } = require('chai');
const { describe, it, before, after } = require('mocha');
const { requestTest, requestHello } = require('../src/httpClient');
const dockerodeFacade = require('./utils/infra/dockerodeFacade');

describe('REST API', () => {
  let containerId;

  before((done) => {
    // docker.pull('chentex/go-rest-api')

    dockerodeFacade.createAndStartContainer(
      done,
      (contId) => (containerId = contId)
    );
  });

  it('should return the expected message on the "Test" endpoint', () => {
    requestTest()
      .then((data) => {
        expect(data.body.message).to.be.equal('This is a Test');
      })
      .catch((err) => {
        assert.fail('expected', 'actual', err);
      });
  });

  it('should return a greeting with the name passed to the request on the "Hello" endpoint', () => {
    requestHello('Mocha')
      .then((data) => {
        expect(data.body.message).to.be.equal('Hola Mocha');
      })
      .catch((err) => {
        assert.fail('expected', 'actual', err);
      });
  });

  after((done) => {
    dockerodeFacade.stopAndRemoveContainer(done, containerId);
  });
});

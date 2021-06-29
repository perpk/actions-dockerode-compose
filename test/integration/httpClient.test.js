const { expect, assert } = require('chai');
const { describe, it, before, after } = require('mocha');
const { requestTest, requestHello } = require('../../src/httpClient');
const dockerodeFacade = require('../utils/infra/dockerodeFacade');
require('dotenv').config()

const gh_username = process.env.GH_USER;
const gh_token = process.env.GH_TOKEN;

console.log(gh_username);

describe('REST API', () => {
  let containerId;

  before(function (done) {
    this.timeout(60000);
    dockerodeFacade.pullImageAndSpawnContainer(
      done,
      (contId) => (containerId = contId),
      {username: gh_username, password: gh_token}
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

  after(function (done) {
    this.timeout(20000);
    dockerodeFacade.stopAndRemoveContainer(done, containerId);
  });
});

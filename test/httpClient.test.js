const { expect, assert } = require('chai');
const { describe, it, before, after } = require('mocha');
const { requestTest, requestHello } = require('../src/httpClient');
const Docker = require('dockerode');

let containerId;
const docker = new Docker();

describe('REST API', () => {
  before((done) => {
    // await docker.run('chentex/go-rest-api', process.stdout, {Tty: false, ExposedPorts: {'8080/tcp': {}}, PortBindings: {'8080/tcp': [{'HostPort': '8080'}]}});

    // docker.pull('chentex/go-rest-api')

    docker.createContainer(
      {
        Image: 'chentex/go-rest-api',
        name: 'int-test-co',
        Tty: true,
        ExposedPorts: { '8080/tcp': {} },
        PortBindings: { '8080/tcp': [{ HostPort: '8080' }] }
      },
      (err, container) => {
        if (err) {
          done(err);
        }
        containerId = container.id;
        console.log(`created container with id ${containerId}`);
        container.start((err, data) => {
          done();
        });
      }
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
    let container = docker.getContainer(containerId);
    container.stop((err, data) => {
      if (err) {
        console.error(`container with id ${container.id} coulnd't be stopped`);
      }
      container.remove((err, data) => {
        console.log(`container with id ${container.id} is removed`);
        if (err) {
          done(err);
        }
        done();
      });
    });
  });
});

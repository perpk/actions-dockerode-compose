const got = require('got');

const requestTest = async () => {
    return await got.get('http://localhost:8080/test');
}

const requestHello = async (name) => {
    return await got.get(`http://localhost:8080/hola/${name}`);
}

module.exports = {requestTest, requestHello}
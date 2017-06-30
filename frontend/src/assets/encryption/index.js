/**
 * Created by pietler on 13.05.17.
 */
var MyData = {};
MyData.domain = 'http://localhost:3000';
// TODO MyData.domain = environment.apiEndpoint;
MyData.keyStore = new KeyManager();
MyData.token = null;

$(document).ready(() => {
  MyData.keyStore.open();
});

function testCallIndex() {
  return "TestCall index.js " + domain;
}


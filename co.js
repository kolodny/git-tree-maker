var co = require('co');
var Promise = require('bluebird');

co(function *(){
  var a = yield Promise.resolve(3);
  var b = yield Promise.resolve(4);
  debugger
  var c = yield Promise.resolve(5);
  console.log(a);
  console.log(b);
  console.log(c);
})()
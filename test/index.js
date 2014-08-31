var assert = require("assert")
var gitTreeMaker = require('..');
var co = require('co');
var exec = require('co-exec');
var thunkify = require('thunkify');

var tmp = require('tmp');
var dir = thunkify(tmp.dir);
var rimraf = require('rimraf');

rimraf = thunkify(rimraf);


	var tempDir;

	beforeEach(function(next) {
		co(function *() {
			tempDir = (yield dir())[0];
			process.chdir(tempDir);
			next();
		})();
	});
	afterEach(function(next) {
		co(function *(){
			yield rimraf(tempDir);
			next();
		})();
	});

	describe('single path tree', function() {
		it("should have a determinstic tree", function(next) {
			co(function *(){
				var tree = {
					1: {
						2: {
							3: {}
						}
					}
				};
				yield *gitTreeMaker(tempDir, tree);
				var log = yield exec('git log --pretty="%s"');
				assert.equal(log, '3\n2\n1\n');
				next();
			})();
	  	});

		it("should have the complex tree", function(next) {
			co(function *(){
				var tree = {
					1: {
						2: {
							3: {}
						},
						4: {
							5: {}
						}
					}
				};
				yield *gitTreeMaker(tempDir, tree);
				var log = yield exec('git log --all --pretty="%s"');
				for (var i = 1; i < 5; i++) {
					assert((new RegExp(i + '\\n')).test(log))
				}
				next();
			})();
	  	});


	});


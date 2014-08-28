var co = require('co');
var exec = require('co-exec');
var thunkify = require('thunkify');
var Promise = require('bluebird');
var Spawner = require('promise-spawner');
var path = require('path');
var mkdirp = require('mkdirp');
var fs = require('fs');
var _ = require('lodash');

var stat = thunkify(fs.stat);
var append = thunkify(fs.appendFile);
var mkdirp = thunkify(mkdirp);

var tree;

function *gitTreeMaker(workingDir) {
	var stats;

	workingDir = yield *ensureValidGitDir(workingDir);
	return yield *createTree(tree);
}

co(gitTreeMaker)('../tester', {a: {b: {c:{}}}});


function *ensureValidGitDir(dir) {
	dir = dir ? path.resolve(dir) : process.cwd();
	try {
		stats = yield stat(dir);
		if (!stats.isDirectory()) {
			throw new Error(dir + " is a file");
		}
	} catch (e) {
		yield mkdirp(dir);
	}
	process.chdir(dir);
	try {
		var commit = yield exec('git rev-parse HEAD');
	} catch(e) {
		yield exec('git init');
	}
	return dir;
}

function *createTree(tree, lastHash) {
	for (var commit in tree) {
		var subTree = tree[commit];
		if (lastHash) {
			yield exec('git checkout ' + lastHash);
		}
		yield append(commit, commit);
		yield exec('git add .');
		lastHash = yield exec('git commit -m "' + commit + '"');
		createTree(subTree, lastHash);
	}
}
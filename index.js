var co = require('co');
var exec = require('co-exec');
var thunkify = require('thunkify');
var path = require('path');
var mkdirp = require('mkdirp');
var fs = require('fs');

var stat = thunkify(fs.stat);
var append = thunkify(fs.appendFile);
var mkdirp = thunkify(mkdirp);

var tree;

function *gitTreeMaker(workingDir, tree) {
	var stats;

	workingDir = yield *ensureValidGitDir(workingDir);
	yield *createTree(tree);
	// yield exec('git branch -d __private_start');
}

module.exports = gitTreeMaker;

//co(gitTreeMaker)('../tester', require('./test-tree.json'));


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
	yield exec('git init');
	return dir;
}

function *createTree(tree, lastHash) {
	for (var commit in tree) {
		var subTree = tree[commit];
		if (/\./.test(commit)) {
			var branchName = commit.split('.')[1] || commit;
			yield exec('git checkout -b ' + branchName + ' ' + (lastHash || ''));
		}
		if (Object.keys(tree).length > 1 && !/\./.test(commit)) {
			var currentBranch = yield exec('git rev-parse --abbrev-ref HEAD');
			if (!currentBranch) {
				console.warn('you may lose ' + commit);
			}
		}
		commit = commit.split('.')[0];
		yield append(commit, commit + '\n');
		yield exec('git add .');
		yield exec('git commit -m "' + commit + '"');
		var hash = yield exec('git rev-parse HEAD');
		yield *createTree(subTree, hash);
	}
}

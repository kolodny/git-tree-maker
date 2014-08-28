var Promise = require('bluebird');
var Spawner = require('promise-spawner');
var path = require('path');
var mkdirp = require('mkdirp');
var fs = require('fs');
var _ = require('lodash');

var statAsync = Promise.promisify(fs.stat);
var appendAsync = Promise.promisify(fs.appendFile);
var mkdirpAsync = Promise.promisify(mkdirp);

function getGit(workingDir) {
	return function(cmd) {
		return new Promise(function(res, rej) {
			var spawner = new Spawner({out: '', err: ''});
			spawner.spawn('git ' + cmd).then(function(code) {
				res(this.data.out[0]);
			}, function(code) {
				var reason = new Error(this.data.err[0] || this.data.out[0]);
				reason.exitCode = code
				rej(reason);
			});
		});
	};
}

function gitTreeMaker(tree, workingDir) {
	return new Promise(function(resolve, reject) {
		var git;
		debugger;
		workingDir = workingDir ? path.resolve(workingDir) : process.cwd();

		// ensure the directory exists
		statAsync(workingDir).catch(function() {
			return mkdirpAsync(workingDir).then(function() {});
		})
		.then(function(stats) {
			if (stats && !stats.isDirectory()) {
				throw new Error(workingDir + " is a file");
			}
		})
		.then(function() {
			git = getGit(workingDir);

			process.chdir(workingDir);
			// ensure we are in a git repo
			return new Promise(function(res) {
				git('rev-parse')
				.then(res)
				.catch(function() {
					git('init').then(res)
				});
			});
		}).then(function(a) {
			// start making tree
			
			createTree(tree);
			function createTree(tree, lastBranch) {
				return new Promise(function(res) {
					_(tree).each(function(subTree, commit) {
						var thenner = lastBranch ? git('checkout ' + lastBranch) : Promise.resolve();
						thenner
						.then(function() {
							appendAsync(commit, commit + '\n')	
						})
						.then(function() {
							return git('add .');
						}).then(function() {
							return git('commit -m "' + commit + '"');
						})
						.then(function() {
							return git('rev-parse HEAD');
						})
						.then(function(commitHash) {
							createTree(subTree, commitHash);
						})
						.catch(function(err) {
							console.log(err);
						});
					});
				});
			}
		})
	});
}

gitTreeMaker({1: {2: {3:{}}}, '../tester');

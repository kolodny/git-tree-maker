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
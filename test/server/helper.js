'use strict';

require('../../server/models/board.js');

var mongoose = require('mongoose'),
	config = require(__dirname + '/../../server/config/config'),
	path = require('path'),
	fs = require('fs');

if (mongoose.connection.readyState === 0) {
	var db = mongoose.connect(config.mongo.uri, config.mongo.options);
}

module.exports = {
	clearCollections: function(done) {
		var modelsPath = path.join(__dirname, '/../../server/models');
		fs.readdirSync(modelsPath).forEach(function(file) {
			if (/(.*)\.(js$|coffee$)/.test(file)) {
				require(modelsPath + '/' + file);
				var model = mongoose.model(file.charAt(0).toUpperCase() + file.slice(1, -3));
				model.collection.drop();
			}
		});
		done();
	},
	wait: function() {
		console.log('Waiting for db cleaner...');
		setTimeout(function() {}, 500);
		console.log('DB cleaned');
	}
};

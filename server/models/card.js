'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


var CardSchema = new Schema({
	meta: {
		text: String,
		index: Number,
		thumb: Boolean,
	},
	style: {
		edit: Boolean,
		hover: Boolean,
		expand: Boolean,
		color: String
	},
	user: {
		email: String,
		name: String
	}
});

mongoose.model('Card', CardSchema);

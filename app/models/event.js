var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Event', new Schema({ 
	_id: Schema.Types.ObjectId,
	label: String,
	currency: String,
	clients: [ {name: String, weight: Number} ],
	spending: [{
		label: String, 
		amount: Number,
		date: {
			type: Date,
			default: Date.now
		},
		author: String,
		concerned: [{
			name: String,
			weight: Number
		}]
	}]
}));

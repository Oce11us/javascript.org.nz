var Email = require('keystone-email');
var emailDefaults = require('../src/defaults/email').emailDefaults;
var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Enquiry Model
 * =============
 */

var Enquiry = new keystone.List('Enquiry', {
	nocreate: true,
	noedit: true
});

Enquiry.add({
	name: { type: Types.Name, required: true },
	email: { type: Types.Email, required: true },
	phone: { type: String },
	enquiryType: { type: Types.Select, options: [
		{ value: 'committee', label: "General enquiry for the Committee", default: true },
		{ value: 'treasurer', label: "Question for the Treasurer" },
		{ value: 'secretary', label: "Question for the Secretary" },
		{ value: 'president', label: "Question for the President" }
	], required: true },
	message: { type: Types.Markdown, required: true },
	createdAt: { type: Date, default: Date.now }
});

Enquiry.schema.pre('save', function(next) {
	this.wasNew = this.isNew;
	next();
})

Enquiry.schema.methods.sendNotificationEmail = function(callback) {
	new Email('enquiry-notification.pug', emailDefaults).send({
		enquiry: enquiry
	}, {
		to: 'committee@javascript.org.nz',
		from: {
			name: 'JavaScript NZ',
			email: 'contact@javascript.org.nz'
		},
		subject: 'JavaScript NZ website enquiry'
	}, callback)
}

Enquiry.defaultSort = '-createdAt';
Enquiry.defaultColumns = 'name, email, enquiryType, createdAt';
Enquiry.register();

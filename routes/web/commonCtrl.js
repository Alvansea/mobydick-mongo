'use strict';

exports.routes = {
	'/': { get: 'index' }
}

exports.index = function(req, res, next) {
	res.render('web/index', {
		ViewModels: {
			username: 'John Snow'
		}
	});
}
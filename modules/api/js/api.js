(function (ns, g, d, $) {
	if (!$) return;
	
	var api = {
		base: '/_terminal/api/1.0'
	};
	
	api.call = function (endpoint, data) {
		var result = $.Deferred(), settings = {
			url: this.base + endpoint,
			dataType: 'json',
			success: function (data) {
				if (!data) return result.reject({status: 'error', message: 'no data'}); 
				if ('success' !== data.status) return result.reject(data); 
				result.resolve(data);
			},
			error: function (xhr, status, message) {
				result.reject({status: status, message: message});
			}
		};
		
		if (data) {
			settings.method = 'POST';
			settings.data = data;
		}
		$.ajax(settings);

		return result;

	}
	
	g[ns] = g[ns] || {};
	g[ns].api = api;
	
	
	
})('Kuvalda', window, document, jQuery);
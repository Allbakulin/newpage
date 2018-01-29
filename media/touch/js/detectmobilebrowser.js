// DEPRECATED
/*
(function (w, d, $, h) {
	if (w.location.host == h) return;
	
	var isTouchDevice = 'ontouchstart' in w || w.navigator.msMaxTouchPoints,
		noTouch = $.cookie('notouch') == '1' ? true : false;
	
	if (!noTouch && isTouchDevice) {
		var mobile_location = 'http://' + h + w.location.pathname + w.location.search
		w.location.replace(mobile_location);
		
	} else {
		$( d ).on('click', '.b-touch', function() {
			$.cookie('notouch', '0', {
				expires : 30,
				path : '/',
				domain : '.' + location.hostname.split('.').slice(1).join('.')
			});
		});
	}
})(window, document, jQuery, 't.' + location.hostname.split('.').slice(1).join('.') );
*/
(function(ns, g, d, $) {
	if (!g[ns] || !g[ns].api) return;
	
	var api = g[ns].api;
	
	var cart = {};
	
	cart.handlers = [];
	
	cart.on = function (event, handler) {
		if (!(handler instanceof Function)) throw new TypeError('Handler must be a function');
		if (!this.handlers[event]) {
			this.handlers[event] = [];
		}
		this.handlers[event].push(handler);
	};
	
	cart.emit = function (event, data) {
		if (!this.handlers[event]) return;
		this.handlers[event].forEach(function (handler) {
			handler.call(cart, data, event);
		});
	};
	
	cart.add = function (items) {
		var pr = api.call('/cart/items/add', {items: items});
		pr.then(function (data) {
			if ('success' !== data.status) return;
			var added = data.cart.map(function (item) {
				if (!items[item.id]) return null;
				var result = JSON.parse(JSON.stringify(item));
				result.count = items[item.id];
				return result;
			}).filter(function (item) {
				return item;
			});
			cart.emit('add', added);
		})
		return pr;
	}
	
	cart.update = function (items) {
		var result =  api.call('/cart/items/update', {items: items});

		return result;
	}
	
	cart.updatePromo = function () {
		$.get( "/_terminal/api/1.0/coupon/get/data", function( data ) {
		var cart_header_promocode_star_node = false;
    	var cart_header_promocode_star = document.getElementsByClassName("basket-header-coupon-append-flag");
		
		if (cart_header_promocode_star && cart_header_promocode_star[0]) {
			cart_header_promocode_star_node = cart_header_promocode_star[0];
		}

		var promocode = data.promocode;
    	if ( !promocode || promocode.length == 0) {
    		var promocode_info = document.getElementsByClassName("body-col2-basket-promocode-info");
    		while (promocode_info[0].firstChild) {
			    promocode_info[0].removeChild(promocode_info[0].firstChild);
			}
			if (cart_header_promocode_star_node)
				cart_header_promocode_star_node.innerText = '';
    	}
		});
	}

	cart.remove = function (id) {
		var pr = api.call('/cart/items/remove', {id: id});
		pr.then(function (data) {
			if ('success' !== data.status) return;
			var removed = [{
				id: id,
				count: 1
			}];
			cart.emit('remove', removed);
		});
		return pr;
	}
	
	cart.get = function () {
		return api.call('/cart/items');
	}
	
	
	g[ns].cart = cart;
})('Kuvalda', window, document, jQuery);
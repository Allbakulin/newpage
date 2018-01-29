(function (ns, g, d, $, s) {
	
	var gtm = {
		loaded: false,
		handlers: [],
		values: {},
		isInit: false,
		init: function () {
			dataLayer.forEach(gtm.handle, gtm);
			gtm.handle(false);
			gtm.isInit = true;
		},
		
		set: function (name, value) {
			gtm.values[name] = value;
		},
		
		get: function (name, defaultValue) {
			return gtm.values[name] ? gtm.values[name] : defaultValue;
		},
		
		handle: function (message) {
			gtm.handlers.forEach(function (handler) {
				if (handler instanceof Function) {
					try {
						handler.call(gtm, message);													
					} catch (e) {
						if (gtm.debug) {
							console.log(e);
						}
					}
				}
			});			
		},
		
		push: function (message) {
			dataLayer.push(message);
			if (!gtm.isInit) return;
			gtm.handle(message);
		},
			
		setProductClickHandler: function (selector, list) {
			$(d).on('click', selector, function (e) {
				if ($(this).hasClass('firm')) return;
				var data = $(this).siblings('form').data();
				gtm.ecProductClick(data, this.href, list);
				if (this.href) {
					e.preventDefault();					
				}
			});
		},
			
		ecImpressions: function (products) {
			if (!products.length) return;
			gtm.push({
				'ecommerce': {
					'impressions': products
				}
			});
		},
			
		ecProductClick: function (product, url, listing) {
			gtm.push({
		      'event': 'productClick',
		      'ecommerce': {
		        'click': {
		          'actionField': {'list': listing},
		          'products': [product]
		         }
		       },
		       'eventCallback': function() {
		         document.location = url;
		       }
		  	});
		},
			
		ecAdd: function (products) {
			products = products instanceof Array ? products : [products];
			gtm.push({
			  'event': 'addToCart',
			  'ecommerce': {
			    'currencyCode': 'RUR',
			    'add': {
			      'products': products
			    }
			  }
			});
		},
		
		ecRemove: function (products) {
			products = products instanceof Array ? products : [products];
			gtm.push({
				'event': 'removeFromCart',
				'ecommerce': {
					'currencyCode': 'RUR',
					'remove': {
						'products': products
					}
				}
			});
		},
		
		load: function (src, handler, params) {
			if (handler) {
				this.handlers.push(handler);				
			}
			var target = d.getElementsByTagName(s)[0],
				script = d.createElement(s);
			script.async = true;
			script.src = src;
			target.parentNode.insertBefore(script, target);
			
			if (params) {
				params.forEach(function (param) {
					g[param.name] = param.value;					
				})
			}
		}
	};
	
	g[ns] = g[ns] || {};
	g[ns].gtm = gtm;
	
})('Kuvalda', window, document, jQuery, 'script');
(function($, d) {
	if (!$) return;
	
	function init() {
		var regionId = $('#deliveryRegionId').val();
		
		initCart('.header-cart');
		initBuyButton('form.order');
		
		$('input[type="radio"][name="auth"]').on('change', function (e) {
			switch ($(this).val()) {
			case 'auth':
				$('.authblock').show();
				$('.guestorder').hide();
				break;
			case 'guest':
				$('.authblock').hide();
				$('.guestorder').show();
				break;
			}
		});
		
		$('#deliveryRegionId').on('change', function (e) {
			var regionId = $(this).val(),
				$pickup = $('.cart-region-pickup'),
				$delivery = $('.cart-region-delivery');
			$('[data-region]').hide();
			
			if ($pickup.find('[data-region="' + regionId + '"]').length) {
				$pickup.show().find('[data-region="' + regionId + '"]').show();
			} else {
				$pickup.hide();
			}
			
			if ($delivery.find('[data-region="' + regionId + '"]').length) {
				$delivery.show().find('[data-region="' + regionId + '"]').show();
			} else {
				$delivery.hide();
			}
			
			if (20 == regionId) {
				$('.delivery-cityname').show();
				$('.passportInfo').show();
				$('.delivery-email').addClass('indeed');
			} else {
				$('.delivery-cityname').hide();
				$('.passportInfo').hide();
				$('.delivery-email').removeClass('indeed');
			}

			$('.insuranceBlockWrapper').hide();
		}).trigger('change');
		
		$('.delivery-options > input[type="radio"]').on('change', function (e) {
			var $this = $(this);
			if ($this.prop('checked')) {
				switch ($this.data('type')) {
				case 'delivery':
					$('[data-type="pickup"]').prop('checked', false);
					$('.delivery-address').show();
					
					if ($this.data('other')) {
						$('.inputDeliveryOther').prop('disabled', false).show();
					} else {
						$('.inputDeliveryOther').prop('disabled', true).hide();
					}
					
					if ('passport' == $this.data('alias')) {
						$('.delivery-cityname').show();
						$('.passportInfo').show();
						$('.delivery-email').addClass('indeed');
						$('.cart-lifting').hide();
						$('.insuranceBlockWrapper').show();
					} else {
						$('.delivery-cityname').hide();
						$('.passportInfo').hide();
						$('.delivery-email').removeClass('indeed');
						$('.cart-lifting').show();
						$('.insuranceBlock .er_mess').remove();
						$('#insuranceCheckbox').prop( "checked", false );
						$('.insuranceBlockWrapper').hide();
					}
					break;
				case 'pickup':
					$('[data-type="delivery"]').prop('checked', false);
					$('.delivery-address').hide();
					$('.inputDeliveryOther').prop('disabled', true).hide();
					$('.delivery-cityname').hide();
					$('.passportInfo').hide();
					$('.delivery-email').removeClass('indeed');
					$('.cart-lifting').hide();
					break;
				}
			}
		}).trigger('change');
		
		$('.paymentRadio-blockpko, .bankcomment').hide();
		$('.payment-options > input[type="radio"]').on('change', function (e) {
			var $this = $(this);
			if ($this.prop('checked')) {
				switch ($this.data('type')) {
				case 'beznal':
				case 'pko':
					$('.bankcomment').hide();
					$('.paymentRadio-blockpko').show();
					break;
				case 'bank':
					$('.paymentRadio-blockpko').hide();
					$('.bankcomment').show();
					break;
				default:
					$('.paymentRadio-blockpko, .bankcomment').hide();
					break;
				}
			}
		}).trigger('change');
		
		$('#paymentInnInput').on('change', function (e) {
			var $this = $(this);
			if ($this.val().length == 12) {
				$('#paymentKppField').removeClass('indeed').hide();
			} else {
				$('#paymentKppField').addClass('indeed').show();
			}
		}).trigger('change');
		
		var $lifting = $('.cart-lifting'),
			$level = $lifting.find('.cart-lifting-level'),
			$price = $lifting.find('.cart-lifting-level-price'),
			$levelInput = $lifting.find('.cart-lifting-level-value'),
			liftingBasePrice = parseInt($lifting.data('base')),
			liftingMargin = parseInt($lifting.data('margin'));
		
		function getLevel(string) {
			var level = parseInt(string);
			if (isNaN(level)) level = 1;
			if (level > 5) level = 5;
			if (level < 1) level = 1;
			return level;
		}
		
		function calcLiftingPrice(level) {
			return liftingBasePrice + (level - 1) * liftingMargin;
		}
		
		function updateLiftingPrice(level) {
			var price = calcLiftingPrice(level);
			$price.text(price);
		}
		
		$lifting.on('change keyup', '.cart-lifting-level-value', function (e) {
			var $this = $(this),
				value = $this.val(),
				level = getLevel(value);
			updateLiftingPrice(level);
			console.log(value.length, value);
			if ('keyup' == e.type && !value.length) return $this.val(value);
			$this.val(level)
		});
		
		$lifting.on('click', 'input[type=radio]', function () {
			var $this = $(this);
			
			if (!$this.prop('checked')) return;
			if ('yes' == $this.val()) {
				$levelInput.prop('disabled', false);
				$level.show();
			} else {
				$level.hide();
				$levelInput.prop('disabled', true);
			}
		});
		
		$lifting.find('input[type=radio]:checked').trigger('click');
		$lifting.find('.cart-lifting-level-value').trigger('change');

		$('.body-col2-basket-promocode-form-wrapper .body-col2-basket-promocode-link a').on('click', function (e) {
			e.preventDefault();
			if ( $('.body-col2-basket-promocode-form').length > 0 ) {
				$('.body-col2-basket-promocode-form').show();
			}
			else {
				throw new Error('promocode form not found');
			}
		});
	}
	
	$(init);
	
	function initCart(q) {
		document.cart = new HeaderCart({
			el: $(q).get(0)
		});
	}
 	
	
	function initBuyButton(q) {
		if (!$(q).length) return;
		$(d).on('submit.cart', q, handleAddToCart);
	}
	
	function timer(ms, data) {
		var result = $.Deferred();
		setTimeout(function () {
			result.resolve(data);
		}, ms);
		return result;
	}
	
	function setSubmitState($form, state) {
		var states = ['ready', 'work', 'result', 'error'];
		var i = $.inArray(state, states);
		if (i >= 0) {
			$form.removeClass(states.join(' ')).addClass(state);
			$form.attr('data-state', i);
		}
	}
	
	function getItems($form) {
		if ($form.data('id')) {
			var data = {};
			data[$form.data('id')] = $form.find('#count').val() * 1 || 1;
		} else {
			var data = {},
			exp = /basket\[(\d+)\]/,
			parts;
			$form.serializeArray().map(function (item) {
				if (parts = exp.exec(item.name)) {
					data[parts[1]] = item.value;
				}
			});
		}
		return data;
	}
	
	function handleAddToCart(e) {
		var $form = $(this);
    	
    	setSubmitState($form, 'work');
    	var request = document.cart.put({form: getItems($form)});
    	var animation = timer(3000);
    	
    	$.when( request, animation ).then(function () {
    		setSubmitState($form, 'result');
    		timer(5000).done(function () {
    			setSubmitState($form, 'ready');
            });
    	}, function () {
    		setSubmitState($form, 'error');
    		timer(5000).done(function () {
    			setSubmitState($form, 'ready');
    		});
    	});
    	e.preventDefault();
	}
	
})(jQuery, document);

var CartItemModel = CatalogueItemModel.extend({
	numbers: ['price', 'pricePromocode', 'sum'],
	initialize: function () {
		this.autoFormatNumbers();
		this.bind('change:count change:price', this.calculateSum, this);
		this.calculateSum();
	},
	calculateSum: function () {
		var price = this.get('price');
    	var pricePromocode = this.get('pricePromocode');
    	if ( pricePromocode > 0)
    		price = pricePromocode;
		this.set('sum', this.get('count') * price);
	},
	sync: function (method, model, options) {
		options || (options = {});
		var params = {};
		switch (method) {
			case 'delete':
				return Kuvalda.cart.remove(this.get('id'));
			break;
			default:
				return false;
			break;
		}
		return $.ajax(_.extend(params, options));
	}
});

var CartItem = Backbone.View.extend({
    tagName: 'li',
    events: {
        'click .bb-delete': 'clear'
    },
    initialize: function () {
        this.template = _.template($('#t-cart-item').html());
        
        // обновление происходит в HeaderCart.addAll 
        // this.model.bind('change', this.render, this);
        this.model.bind('destroy', this.remove, this);
        
        this.render();
        this.markAsNew();
    },
    render: function () {
    	this.$el.html(this.template(this.model.toJSON()));
    },
    markAsNew: function () {
    	this.$el.addClass('is-new').afterTransition(_.bind(function () {this.$el.removeClass('is-new')}, this));
    },
    clear: function (event) {
    	event.preventDefault();
    	this.$el.addClass('is-removed').afterTransition(_.bind(function () {
    		this.model.destroy();
    	}, this));
    }
});
var CartItems = Backbone.Collection.extend({
	totalSum: 0,
    totalCount: 0,
    model: CartItemModel,
    initialize: function () {
        this.bind('add remove reset cart:updated', this.calcTotalSum, this);
        this.bind('add remove reset cart:updated', this.calcTotalCount, this);
    },
    put: function (options) {
    	var self = this;
    	if (options.id) {
    		var data = {id: options.id, count: options.count || 1};
    	} else if (options.form) {
    		var data = options.form;
    	} else {
    		var data = {items: options.items || {}};
    	}
    	
    	var req = Kuvalda.cart.add(data);
    	req.then(function (data) {
    		self.trigger('put:success', req, data);
			// TODO: возможно неплохо получится если заменить reset на add
    		self.parseResponse(data);
    		self.trigger('cart:updated');
		}, function (data) {
    		self.trigger('put:error', req, data);
		});
    	return req;
    },
    parseResponse: function (response) {
    	_.each(response.cart, function (item) {
    		if (this.get(item.id)) {
    			this.get(item.id).set('count', item.count);
    		} else {
    			this.add(item);
    		}
    	}, this);
    },
    url: '/_terminal/cart/main/cart.json',
    comparator: function (model) {
        return model.get('id');
    },
    calcTotalSum: function () {
        var total = 0; 
        this.each(function (item) {
        	var price = item.get('price');
        	var pricePromocode = item.get('pricePromocode');
        	if ( pricePromocode > 0)
        		price = pricePromocode;
            total += item.get('count') * price;
        });
        this.totalSum = total;
    },
    calcTotalCount: function () {
        var total = 0; 
        this.each(function (item) {
            total += item.get('count');
        });
        this.totalCount = total;
    }
});

var CartPromocodeModel = Backbone.Model.extend({
    url: '/_terminal/api/1.0/coupon/get/data',
    parse: function (response) {
    	return response;
    },
    toJSON: function(options) {
	  return _.clone(this.attributes);
	}
});

var CartPromocodeView = Backbone.View.extend({
    initialize: function () {
        this.template = _.template($('#t-cart-promocode').html());
        var self = this;
        this.model.fetch().done(function () {
       	    self.render();
        })
    },
    render: function () {
    	var discount = this.model.get('discount');
    	discount = discount > 0 ? discount*100: 0;

    	var promocode = this.model.get('promocode');
    	promocode = promocode && promocode.length > 0 ? promocode: false;

    	this.$el.html(
    		this.template(
    			{
    				promocode: promocode,
    				discount: discount
    			}
    		)
    	);
    	return this;
    },
	checkPromocode: function() {
		var self = this;
		setTimeout(
			function() {
		        self.model.fetch().done(function () {
		       	    self.render();
		        })
			},
			1000
		);
	}
});

var HeaderCart = HeaderBlock.extend({
	smoothTimeout: 2000, // сглаживание
	abortTimeout: 10000, // отмена запроса, если нет ответа
	animationTimeout: 3000,
	animationStage: 0, // 0 = none -> 1 = forward -> 2 = backward -> 0 = none
	animationRepeat: false,
	events: {
        'click .bb-list-opener': 'toggle'
    },
    initialize: function () {
    	this.observeClick();
        this.observeEsc();
        
    	$(window).resize(_.bind(this.toggleStyle, this));
    	if (this.options.smoothTimeout) {
    		this.smoothTimeout = this.options.smoothTimeout;
    	}
    	if (this.options.abortTimeout) {
    		this.abortTimeout = this.options.abortTimeout;
    	}
    	
    	this.countTemplate = _.template($('#t-cart-count').html());
    	
    	this.views = {};
    	this.items = new CartItems();
		this.items.abortTimeout = this.abortTimeout;
    	
		//this.items.bind('add', this.add, this);
        this.items.bind('reset', this.addAll, this);
        this.items.bind('remove', this.remove, this);
        this.items.bind('reset remove', this.render, this);
        
        this.items.bind('put:success put:error', this.parsePutResponse, this);
        this.items.bind('cart:updated', this.repeatAnimation, this);
        
        this.bind('animation:stage2', this.addAll, this);
        this.bind('animation:stage2', this.render, this);

        this.items.fetch();

        this.promocode = new CartPromocodeModel();
        this.promocode.cartitems = this.items;
		this.promocode.abortTimeout = this.abortTimeout;

		this.promocodeView = new CartPromocodeView({ model: this.promocode, el: $('.header-cart-list-promocode') });

		this.promocodeView.listenTo(this.items, "add remove reset cart:updated", this.promocodeView.checkPromocode);
    },
    repeatAnimation: function () {
    	if (this.animationStage == 2) {
    		this.animationRepeat = true;
    	}
    },
    // функция вызова анимации с грузовиком
    playAnimation: function () {
    	if (this.animationStage == 0) {
    		this.animationStage1();
    	}
    },
    // начало анимации - погрузчик едет к грузовику 
    animationStage1: function () {
    	this.animationStage = 1;
    	this.trigger('animation:stage1');
    	this.$('.header-cart-info-icon').addClass('is-animated');
    	
    	setTimeout(_.bind(this.animationStage2, this), this.animationTimeout / 2); 
    	setTimeout(_.bind(this.animationStage3, this), this.animationTimeout); 
    },
    // середина анимации - погрузчик загружает товар в грузовик
    animationStage2: function () {
    	this.animationStage = 2;
    	this.trigger('animation:stage2');
    },
    // конец анимации - возвращение к исходному состоянию
    animationStage3: function () {
    	this.trigger('animation:stage3');
    	this.$('.header-cart-info-icon').removeClass('is-animated');
    	this.animationStage = 0;
    	
    	if (this.animationRepeat) {
    		this.animationRepeat = false;
    		this.playAnimation();
    	}
    },
    // подстраивание стиля оформления корзины под высоту экрана
    toggleStyle: function () {
    	if ( parseInt(($(window).height() - $('.header').height()) / 82 - 1) < this.items.length ) {
			this.$('.header-cart-list').addClass('is-short');
		} else {
			this.$('.header-cart-list').removeClass('is-short');
		}
    },    
    // помечаем корзину как пустую или не пустую
    toggleEmptyFlag: function () {
    	this.items.totalCount ? this.$el.removeClass('is-empty') : this.$el.addClass('is-empty');
    	if (!this.items.totalCount) {
    		this.close();
    	}
    },
    // обновление заголовка корзины с количеством товаров
    updateCaption: function () {
    	var countData = {
			count: this.items.totalCount,
			dimension: Utils.getPlural(this.items.totalCount, ['товар', 'товара', 'товаров']) 
    	};
    	if ( $('#account-left-menu-cart-item-count').length ) {
    		var account_cart_count_text = this.items.totalCount + ' ' + Utils.getPlural(this.items.totalCount, ['товар', 'товара', 'товаров']);
    		if ( account_cart_count_text != $('#account-left-menu-cart-item-count').text() ) {
    			$('#account-left-menu-cart-item-count').text(this.items.totalCount + ' ' + Utils.getPlural(this.items.totalCount, ['товар', 'товара', 'товаров']) );
    		}
    	}
    	this.$('.bb-list-count').html(this.countTemplate(countData));
    },
    // обновление общей суммы
    updateTotalSum: function () {
    	var totalSumFormatted = $.formatNumber(this.items.totalSum, {format:"#,###.##", locale:"ru"});
    	this.$('.bb-total-sum').text(totalSumFormatted);
    },
    render: function () {
    	this.$el.show();
    	this.toggleStyle();
    	this.toggleEmptyFlag();
    	this.updateCaption();
    	this.updateTotalSum();
    },
    put: function (options) {
    	var xhr = this.items.put(options);
    	xhr.time = (new Date()).getTime() + this.smoothTimeout;
    	xhr.successCallback = options.success;
    	xhr.errorCallback = options.error;
    	return xhr;
    },
    parsePutResponse: function (xhr, response) {
		var offset = xhr.time - new Date().getTime();
		if (offset <= 0) {
			// run callback
			switch (response.status) {
				case 'success':
					this.playAnimation();
					if (_.isFunction(xhr.successCallback)) {
						xhr.successCallback(response);
					}
				break;
				default:
					this.trigger('error:put');
					if (_.isFunction(xhr.errorCallback)) {
						xhr.errorCallback();
					}
				break;
			}
		} else {
			// timeout
			setTimeout(_.bind(this.parsePutResponse, this, xhr, response), offset);
		}
    },
    remove: function (model) {
    	this.views[model.id] = null;
    },
    add: function (model) {
    	if (_.has(this.views, model.id) && this.views[model.id]) {
    		this.views[model.id].render();
    	} else {
	    	var item = new CartItem({model: model});
	        this.$(".bb-cart-items").append(item.el);
	        
	        this.views[model.id] = item;
    	}
    },
    addAll: function () {
    	this.items.each(this.add, this);
    },
    open: function () {
        if (this.items.totalCount) {
        	this.$el.addClass('is-selected');
        }
    },
    close: function () {
        this.$el.removeClass('is-selected');
    },
    toggle: function (event) {
        if (this.items.totalCount) {
        	event ? event.preventDefault() : null;
        	this.$el.toggleClass('is-selected');
        }
    },
    blur: function () {
        this.close();
    }
});
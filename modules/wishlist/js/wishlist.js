(function (ns, g, d, $, s) {
	if (!g[ns] || !g[ns].api) return;
	
	var api = g[ns].api;

	function getPlural (num) {
		forms = ['товар', 'товара', 'товаров'];

		var n = num % 100;
		var n1 = num % 10;
		
		if (n > 10 && n < 20)
		{
			return forms[2];
		}
		else if (n1 > 1 && n1 < 5)
		{
			return forms[1];
		}
		else if (n1 == 1)
		{
			return forms[0];
		} else {
			return forms[2];
		}
	}	

	function initCount() {
		$.ajax({
			url: api.base + '/wishlist/check/auth',
			method: 'POST',
			dataType: 'json',
			success: function(data) {
				if ( data == true ) {
					$.ajax({
						url: api.base + '/wishlist/get/count',
						method: 'POST',
						dataType: 'json',
						beforeSend : function() {
							
						},
						success: function(count) {
							if ( count > 0) {
								$('.header-wishlist-info-count').text(count + ' ' + getPlural(count));
								if ( ('#account-left-menu-wishlist-item-count').length ) {
									$('#account-left-menu-wishlist-item-count').text(count + ' ' + getPlural(count));
								}
								$('.header-wishlist').show();
							}
							else {
								$('.header-wishlist').hide();
							}
						},
						error: function(e){

						}
					});
						
				}
				else {
					if ( $.cookie('wishlist') != undefined && $.cookie('wishlist') != null && $.cookie('wishlist') != '') {
						var wishlist_items_ids = $.cookie('wishlist').split('|');
						var count = wishlist_items_ids.length;
						if ( count > 0) {
							$('.header-wishlist-info-count').text(count + ' ' + getPlural(count));
							$('.header-wishlist').show();
						}
						else {
							$('.header-wishlist').hide();
						}
					}
					else {
						$('.header-wishlist-info-count').text('');
						$('.header-wishlist').hide();
					}
				}
			},
			error: function() {
	        }
		});
	}

	function checkAdded(link, item_id) {
		var result = false;
		$.ajax({
			url: api.base + '/wishlist/check/auth',
			method: 'POST',
			dataType: 'json',
			success: function(data) {
				if ( data == true ) {
					$.ajax({
						url: api.base + '/wishlist/check/item',
						method: 'POST',
						dataType: 'json',
						data: {'id': item_id},
						beforeSend : function() {
							
						},
						success: function(data) {
							if (data == true) {
								$(link).removeClass('is-wishlist-add').addClass('is-wishlist-remove');
								$(link).text('Удалить из избранного');
							}
						},
						error: function(e){

						}
					});
						
				}
				else {
					if ( $.cookie('wishlist') != undefined && $.cookie('wishlist') != null && $.cookie('wishlist') != '') {
						var wishlist_items_ids = $.cookie('wishlist').split('|');
						var index = wishlist_items_ids.indexOf(item_id.toString());

						if (index != -1) {
							(link).removeClass('is-wishlist-add').addClass('is-wishlist-remove');
							$(link).text('Удалить из избранного');
						}
					}
				}
			},
			error: function() {
	        }
		});

		return result;
	}

	function handleClear() {
		var result = false;
		$.ajax({
			url: api.base + '/wishlist/check/auth',
			method: 'POST',
			dataType: 'json',
			success: function(data) {
				if ( data == true ) {
					$.ajax({
						url: api.base + '/wishlist/clear/items',
						method: 'POST',
						dataType: 'json',
						beforeSend : function() {
							
						},
						success: function(data) {
							if (data == true) {
								$('.wishlist-wrapper .masonry-layout').empty();
								$('.wishlist-empty-message').text('Нет товаров');
								if ( $('#account-left-menu-wishlist-item-count').length ) {
									$('#account-left-menu-wishlist-item-count').text('0 товаров');
								}
							}
						},
						error: function(e){

						}
					});
						
				}
				else {
					$.removeCookie('wishlist', { path: '/' });
					$('.wishlist-wrapper .masonry-layout').empty();
					$('.wishlist-empty-message').text('Нет товаров');
					if ( $('#account-left-menu-wishlist-item-count').length ) {
						$('#account-left-menu-wishlist-item-count').text('0 товаров');
					}
				}
				$('.header-wishlist').hide();
				$('.wishlist-wrapper-clear-all').remove();
				$("html, body").animate({ scrollTop: 0 }, "slow");
			},
			error: function() {
	        }
		});

		return result;
	}

	function handleDelete(link, item_id) {
		var result = false;
		$.ajax({
			url: api.base + '/wishlist/check/auth',
			method: 'POST',
			dataType: 'json',
			success: function(data) {
				if ( data == true ) {
					$.ajax({
						url: api.base + '/wishlist/unset/item',
						method: 'POST',
						dataType: 'json',
						data: {'id': item_id},
						beforeSend : function() {
							
						},
						success: function(data) {
							if (data == true) {
								$(link).parent().remove();
								if ( $('.wishlist-wrapper .masonry-panel').length == 0 ) {
									$('.wishlist-empty-message').text('Нет товаров');
									if ( $('#account-left-menu-wishlist-item-count').length ) {
										$('#account-left-menu-wishlist-item-count').text('0 товаров');
										$('.wishlist-wrapper-clear-all').remove();
										$("html, body").animate({ scrollTop: 0 }, "slow");
									}
								}
								initCount();
							}
						},
						error: function(e){

						}
					});
				}
				else {
					$(link).parent().remove();
					if ( $.cookie('wishlist') != undefined && $.cookie('wishlist') != null && $.cookie('wishlist') != '') {
						var wishlist_items_ids = $.cookie('wishlist').split('|');
						var index_to_remove = wishlist_items_ids.indexOf(item_id.toString());

						if (index_to_remove != -1) {
							wishlist_items_ids.splice(index_to_remove, 1);
						}

						if ( wishlist_items_ids.length > 0) {
							$.cookie('wishlist', wishlist_items_ids.join('|'), { path: '/' });
						}
						else {
							$.removeCookie('wishlist', { path: '/' });
						}
					}
					else if ( $.cookie('wishlist') == null || $.cookie('wishlist') == '' ) {
						$.removeCookie('wishlist', { path: '/' });
					}

					if ( $('.wishlist-wrapper .masonry-panel').length == 0 ) {
						$('.wishlist-empty-message').text('Нет товаров');
						$('.wishlist-wrapper-clear-all').remove();
						$("html, body").animate({ scrollTop: 0 }, "slow");
					}

					initCount();
				}

			},
			error: function() {
	        }
		});

		return result;
	}

	function handleClick(link, item_id) {
		var result = false;
		$.ajax({
			url: api.base + '/wishlist/check/auth',
			method: 'POST',
			dataType: 'json',
			success: function(data) {
				if ( data == true ) {
					//add
					if ( $(link).hasClass('is-wishlist-add')) {
						$.ajax({
							url: api.base + '/wishlist/set/item',
							method: 'POST',
							dataType: 'json',
							data: {'id': item_id},
							beforeSend : function() {
								
							},
							success: function(data) {
								if (data == true) {
									$(link).removeClass('is-wishlist-add').addClass('is-wishlist-remove');
									$(link).text('Удалить из избранного');
									initCount();
								}
							},
							error: function(e){

							}
						});
						
					}
					else {
						$.ajax({
							url: api.base + '/wishlist/unset/item',
							method: 'POST',
							dataType: 'json',
							data: {'id': item_id},
							beforeSend : function() {
								
							},
							success: function(data) {
								if (data == true) {
									$(link).removeClass('is-wishlist-remove').addClass('is-wishlist-add');
									$(link).text('Добавить в избранное');
									initCount();
								}
							},
							error: function(e){

							}
						});
					}
				}
				else {
					//add
					if ( $(link).hasClass('is-wishlist-add')) {
						if ( $.cookie('wishlist') == undefined ) {
							$.cookie('wishlist', item_id, { path: '/' });
						}
						else {
							var wishlist_items_ids = $.cookie('wishlist').split('|');
							if ( wishlist_items_ids.indexOf(item_id.toString()) == -1 ) {
								wishlist_items_ids.push(item_id);
							}
							$.cookie('wishlist', wishlist_items_ids.join('|'), { path: '/' });
						}
						$(link).removeClass('is-wishlist-add').addClass('is-wishlist-remove');
						$(link).text('Удалить из избранного');
					}
					//delete
					else {
						if ( $.cookie('wishlist') != undefined && $.cookie('wishlist') != null && $.cookie('wishlist') != '') {
							var wishlist_items_ids = $.cookie('wishlist').split('|');
							var index_to_remove = wishlist_items_ids.indexOf(item_id.toString());

							if (index_to_remove != -1) {
								wishlist_items_ids.splice(index_to_remove, 1);
							}

							if ( wishlist_items_ids.length > 0) {
								$.cookie('wishlist', wishlist_items_ids.join('|'), { path: '/' });
							}
							else {
								$.removeCookie('wishlist', { path: '/' });
							}
						}
						else if ( $.cookie('wishlist') == null || $.cookie('wishlist') == '' ) {
							$.removeCookie('wishlist', { path: '/' });
						}

						$(link).removeClass('is-wishlist-remove').addClass('is-wishlist-add');
						$(link).text('Добавить в избранное');
					}
					initCount();
				}

			},
			error: function() {
	        }
		});

		return result;
	}

	$(document).ready( function() {

		initCount();

		//check if arleady added;
		if ( $('.js-toggle-wishlist').length == 1 ) {
			var item_id = $('.js-toggle-wishlist').data('item-id');
			checkAdded($('.js-toggle-wishlist'), item_id);
		}

		//handle clicks
		$('.js-toggle-wishlist').click( function(event) {
			event.preventDefault();
			var item_id = $(this).data('item-id');
			handleClick(this, item_id);
		});

		$('.wishlist-wrapper-clear-all button').click( function () {
			if (confirm('Вы действительно хотите очистить список избранных товаров?')) {
				handleClear();
			} else {

			}
		});

		$('.wishlist-delete-item').click( function(event) {
			event.preventDefault();
			if (confirm('Вы действительно хотите удалить товар из избранного?')) {
				var item_id = $(this).data('item-id');
				handleDelete(this, item_id);
			} else {

			}
			
		});

	});

})('Kuvalda', window, document, jQuery, 'script');
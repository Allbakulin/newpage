(function (ns, g, d, $, s) {
	if (!g[ns] || !g[ns].api) return;
	
	var api = g[ns].api;

	function setLastNotification(id) {
		$.ajax({
			url: api.base + '/account/check/auth',
			method: 'POST',
			dataType: 'json',
			success: function(data) {
				if ( data == true ) {
					$.ajax({
						url: api.base + '/notifications/set/last',
						method: 'POST',
						dataType: 'json',
						data: {id: id},
						beforeSend : function() {
						},
						success: function(result) {
						},
						error: function(e){

						}
					});
						
				}
			},
			error: function() {
	        }
		});
	}

	function initNotifications() {
		$.ajax({
			url: api.base + '/account/check/auth',
			method: 'POST',
			dataType: 'json',
			success: function(data) {
				if ( data == true ) {
					$.ajax({
						url: api.base + '/notifications/get/list',
						method: 'POST',
						dataType: 'json',
						beforeSend : function() {
							
						},
						success: function(result) {
							if ( result['success'] == true) {
									var last_notification_id = false;
									if ( result['list'].length > 0) {
										var last_notification_id = result['list'][0]['id'];
										$('.header-notifications').data('last-notification-id', last_notification_id);

										var client_last_notification_id = false;
										if (result['last_id'] > 0 ) {
											client_last_notification_id = result['last_id'];
										}
										else {
											client_last_notification_id = $.cookie('last-notification-id') ? $.cookie('last-notification-id') : false;
										}
										var new_notification_count = 0;
										
										if ( !client_last_notification_id || (client_last_notification_id && last_notification_id != client_last_notification_id )) {
											
											result['list'].forEach(function(item, i, arr) {
												if (item['id'] > client_last_notification_id ) {
													new_notification_count++;
													result['list'][i]['new'] = true;
												}
											});
										}

										if ( new_notification_count > 0) {
											$('.header-notifications-new-count').text(new_notification_count);
										}
									}

									$('.header-notifications-list-wrapper').empty();
									result['list'].reverse().forEach(function(item, i, arr) {
										var date  = item['create_date'];
										var message = '';

										switch(item['type']) {
											case 'order':
												message = '<p class="header-notification-order-id">Заказ <a href="' + item['order_link'] + '">№' + item['order_id'] + '</a>, автоматическое уведомление:';
												message += '<p class="header-notification-order-message">' + item['message'] + '</p>';
												break;
										};


										item['new'] = item['new'] ? 'header-notification-new' : '';

										var $notification = '<div class="header-notification ' + item['new'] + '">\
																<div class="header-notification-date">\
																	' + date + '\
																</div>\
																<div class="header-notification-message">\
																	' + message + '\
																</div>\
															</div>';
										$('.header-notifications-list-wrapper').prepend($notification);
									});
							}
						},
						error: function(e){

						}
					});
						
				}
			},
			error: function() {
	        }
		});
	}

	function toggleList() {
		if ($('.header-auth').hasClass('is-selected') == true) {
			$('.header-auth').removeClass('is-selected');
			$('.header-auth.is-selected.is-signed-in .header-auth-logout').hide();
		}

		$('.header-notifications-list-wrapper').toggle();
		$('.header-notifications').toggleClass('header-notifications-is-opened');
		if ( $('.header-notifications').hasClass('header-notifications-is-opened') ) {
			var last_notification_id = $('.header-notifications').data('last-notification-id');
			$.cookie('last-notification-id', last_notification_id, { path: '/' });
			setLastNotification(last_notification_id);
		}

		$('.header-notifications-new-count').empty();
	}

	$(document).ready( function() {

		initNotifications();

		var repeat_interval = 5*60*1000;
		
		setInterval(function(){ 
			initNotifications();
		}, repeat_interval);

		$( "body" ).on( "click", ".header-notifications-open-list-link", function(event) {
			event.preventDefault();
			toggleList();
		});

		$( "body" ).on( "click", ".header-notifications-new-count", function(event) {
			event.preventDefault();
			toggleList();
		});

		$( "body" ).on( "click", ".header-auth-link", function(event) {
			event.preventDefault();
			if ($('.header-notifications').hasClass('header-notifications-is-opened') == true) {
				$('.header-notifications').removeClass('header-notifications-is-opened');
				$('.header-notifications-list-wrapper').hide();
			}

		});

		$( window ).scroll(function() {
			if ( $('.header-notifications-list-wrapper').css('display') != 'none' ){
				$('.header-notifications-list-wrapper').hide();
			}
		});

	});



})('Kuvalda', window, document, jQuery, 'script');
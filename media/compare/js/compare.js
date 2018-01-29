(function ($) {
	var defaultOptions = {
		readyClassName: 'with-js',
		toggleLinkClassName: 'js-compare-toggle',
		deleteLinkClassName: 'compare-item-delete',
		tableShortClassName: 'is-short',
		tableMiniClassName: 'is-mini',
		holderClassName: 'compare-holder',
		paramsClassName: 'params-clone',
		itemsClassName: 'items-clone',
		cellClassName: 'cell-clone',
		markedCellClassName: 'compare-user-choice-param',
		headerHeight: 24	
	};
	var options = {};
	
	var itemsScroll = function (event) {
		this.$items.css({marginLeft: -$(event.currentTarget).scrollLeft()});
	};
	var itemsFix = function (event) {
		var $table = this.$table;
		
		if (this.$table.offset().top - options.headerHeight <= $(document).scrollTop()) {
			if ($(document).height() - 50 >= $(window).height() + $(document).scrollTop()) {
				this.$table.addClass(options.tableMiniClassName);
				this.$params.addClass(options.tableMiniClassName);
				this.$items.addClass(options.tableMiniClassName).show();
				this.$cellContainer.show();
				
				this.$table.find('form').each(function (index, form) {
					$(form).parents('td').css('height', $(form).outerHeight());
					$table.find('tfoot td').eq(index+1).append(form);
				});
				
				$(this).trigger('resize.kuvaldaCompareTable');
			}
		} else {
			this.$table.removeClass(options.tableMiniClassName);
			this.$params.removeClass(options.tableMiniClassName);
			this.$items.removeClass(options.tableMiniClassName).hide();
			this.$cellContainer.hide();
			
			this.$table.find('form').each(function (index, form) {
				$(form).parents('td').css('height', 'auto');
				$table.find('thead td').eq(index+1).append(form);
			});

			$(this).trigger('resize.kuvaldaCompareTable');
		}
		
		var top = (this.$table.outerHeight() + this.$table.offset().top) - (this.$items.outerHeight() + $(document).scrollTop() + this.$table.find('.compare-table-foot').outerHeight());
		top = top < 0 ? top : 0;
		this.$cellContainer.css({marginTop: top});
		this.$items.css({marginTop: top});
	};
	var resizeCells = function ($clone) {
		var $original = $clone.$original;
		$clone.find('td').each(function (i, td) {
			if (0) {
    			$(td).css({
    				height: $.browser.webkit ? $original.eq(i).height() : $original.eq(i).outerHeight(),
    				width: $.browser.webkit ? $original.eq(i).width() : $original.eq(i).outerWidth()
    			});
			}
			else
			{
    			$(td).css({
    				height: $original.eq(i).height(),
    				width: $original.eq(i).height()
    			});
				
			}
		});
	};
	var toggleTableShortLink = function () {
		var $table = this.$table;
		if (this.$table.hasClass(options.tableShortClassName)) {
			this.$toggleLinks.text(this.$toggleLinks.data('full'));
		} else {
			this.$toggleLinks.text(this.$toggleLinks.data('short'));
		}
	};
	var toggleTable = function (event) {
		event ? event.preventDefault() : null;
		this.$table.toggleClass(options.tableShortClassName);
		this.$params.toggleClass(options.tableShortClassName);
		
		toggleTableShortLink.apply(this);
		
		$(this).trigger('resize.kuvaldaCompareTable');
	};
	
	var deleteItemHandler = function (event) {
		event.preventDefault();
		var $link = $(event.currentTarget);
		document.compare.removeItem($link.data('item-id'));
		
		var index = $link.closest('td').index();
		this.$table.find('tr').find('td:eq(' + index + ')').fadeOut(500, deleteItemNode);
		this.$items.find('tr').find('td:eq(' + index + ')').fadeOut(500, deleteItemNode);
		
		this.itemIds = _.without(this.itemIds, $link.data('item-id'));
		if (this.itemIds.length == 1) {
			var $item = $('.compare-item-' + this.itemIds[0]).eq(0);
			document.location.href = $item.data('url');
		}
	};
	var deleteItemNode = function () {
		$(this).remove();
	};
	var markCell = function (event) {
		event.preventDefault();
		
		$(event.currentTarget).toggleClass(options.markedCellClassName);
	};
	
	var methods = {
		init : function (settings) {
			$.extend(true, options, defaultOptions, settings);
			return this.each(function () {
				var $this = $(this);
				$this.data('kuvaldaCompareTable', options);
				$this.addClass(options.readyClassName);
				
				this.$table = $('table', this);
				
				// wrap table for good scroll
				this.$container = $('<div class="' + options.holderClassName + '" />');
				this.$container.appendTo(this).append(this.$table);
				
				// clone table for fixed first column (names of params)
				this.$params = this.$table.clone();
				this.$params.find('td:not(:first-child)').remove();
				this.$params.addClass(options.paramsClassName).appendTo(this.$container);
				// to find original cells by index
				this.$params.$original = this.$table.find('td:first-child');
				var $table = this.$table;
				this.$params.find('tr').each(function (index, tr) {
					if (index) {
						var $origin = $table.find('tr').eq(index);
						var $tr = $(tr);
						
						$tr.hover(function () {
							$origin.addClass('hover');
						}, function () {
							$origin.removeClass('hover');
						});
						
						$origin.hover(function () {
							$tr.addClass('hover');
						}, function () {
							$tr.removeClass('hover');
						});
					}
				});
				
				// clone table for fixed first row (items)
				this.$items = this.$table.clone();
				this.$items.find('tbody, tfoot, tr:not(:first-child)').remove();
				this.$items.addClass(options.itemsClassName).appendTo(this.$container).css({top: options.headerHeight}).hide();
				
				// clone table for fixed first cell ("all params" link)
				this.$cellContainer = $('<div class="' + options.cellClassName + '" />');
				this.$cellContainer.appendTo(this.$container).css({top: options.headerHeight}).hide();
				
				this.$cell = this.$table.clone();
				this.$cell.find('tbody, tfoot, tr:not(:first-child), td:not(:first-child)').remove();
				this.$cell.appendTo(this.$cellContainer);
				// to find original cells by index
				this.$cell.$original = this.$items.find('tr:first-child td:first-child');
				
				this.$container.bind('scroll.kuvaldaCompareTable', $.proxy(itemsScroll, this));
				$(window).bind('load.kuvaldaCompareTable', $.proxy(resizeCells, this, this.$params));
				$(document).bind('scroll.kuvaldaCompareTable', $.proxy(itemsFix, this));
				
				$this.bind('resize.kuvaldaCompareTable', $.proxy(resizeCells, this, this.$params));
				$this.bind('resize.kuvaldaCompareTable', $.proxy(resizeCells, this, this.$cell));
				
				this.$toggleLinks = $('.' + options.toggleLinkClassName, this);
				this.$toggleLinks.bind('click.kuvaldaCompareTable', $.proxy(toggleTable, this));
				
				this.$deleteLinks = $('.' + options.deleteLinkClassName, this);
				this.$deleteLinks.bind('click.kuvaldaCompareTable', $.proxy(deleteItemHandler, this));
				
				var ids = [];
				this.$deleteLinks.each(function (i, e) {
					ids.push($(e).data('item-id'));
				});
				this.itemIds = _.uniq(ids);
				
				this.$cells = $('tbody td', this.$table);
				this.$cells.bind('click.kuvaldaCompareTable', $.proxy(markCell, this));
				
				toggleTableShortLink.apply(this);
			});
		},
		destroy : function () {
			$(window).unbind('.kuvaldaCompareTable');
			$(document).unbind('.kuvaldaCompareTable');
			
			return this.each(function () {
		        this.$table.appendTo(this).removeClass(options.tableShortClassName);
		        this.$container.remove();
		        this.$params.remove();
		        this.$items.remove();
		        this.$cellContainer.remove();
		        
		        this.$toggleLinks.undind('.kuvaldaCompareTable');
		        this.$deleteLinks.undind('.kuvaldaCompareTable');
		        this.$cells.unbind('.kuvaldaCompareTable');
		        
		        this.$params = null;
		        this.$items = null;
		        this.$cellContainer = null;
		        this.$toggleLinks = null;
		        this.$deleteLinks = null;
		        this.$table = null
		        this.$container = null;
		        this.$cells = null;
		        
		        var $this = $(this);
		        $this.unbind('.kuvaldaCompareTable');
		        $this.removeClass(options.readyClassName);
				$this.removeData('kuvaldaCompareTable');
			});
		}
	};
	$.fn.kuvaldaCompareTable = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call( arguments, 1));
		} else if (typeof method === 'object' || ! method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  method + ' does not exist on jQuery.kuvaldaCompareTable');
		}
	};
})(jQuery);

(function( $ ) {
	var defaultOptions = {
		deleteGroup: '.del-compare-list',
		item: '.compare-item',
		deleteItem: '.compare-item-delete'
	};
	var options = {};
	
	var deleteItem = function (event) {
		event.preventDefault();
		var $link = $(event.currentTarget);
		var $item = $link.closest(options.item);
		
		$item.fadeOut(500, function () {
			$(this).remove();
		});
		
		document.compare.removeItem($link.data('item-id'));
	};
	var deleteGroup = function (event) {
		event.preventDefault();
		
		$(this).fadeOut(500, function () {
			$(this).remove();
		});
		
		document.compare.removeGroup($link.data('group-id'));
	};
	
	var methods = {
		init : function (settings) {
			$.extend(true, options, defaultOptions, settings);
			
			return this.each(function () {
				var $this = $(this);
				
				$this.find(options.deleteGroup).bind('click.kuvaldaCompareList', $.proxy(deleteGroup, this));
				$this.find(options.deleteItem).bind('click.kuvaldaCompareList', $.proxy(deleteItem, this));
			});
		},
		destroy: function () {
			return this.each(function () {
				var $this = $(this);
				
				$this.find(options.deleteGroup).unbind('.kuvaldaCompareList');
				$this.find(options.deleteItem).unbind('.kuvaldaCompareList');
			});
		}
	};
	
	$.fn.kuvaldaCompareList = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || ! method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  method + ' does not exist on jQuery.kuvaldaCompareList');
		}
	};

})( jQuery );
(function( $ ) {
	var defaultOptions = {};
	var options = {};
	
	var addToCompare = function () {
		this.addClass('is-active');
		this.attr('title', this.data('compare-remove-text'));
	};
	var removeFromCompare = function () {
		this.removeClass('is-active');
		this.attr('title', this.data('compare-add-text'));
	};
	
	var click = function (event) {
		event.preventDefault();
		
		var $button = $(event.currentTarget);
		var itemId = $button.data('item-id');
		var itemName = $button.data('item-name');
		
		if (document.compare.isItemExists(itemId)) {
			try {
				ga('send', 'event', 'Compare', 'RemoveItem', itemName);
	    	}  catch(err) {}
			document.compare.removeItem(itemId);
			removeFromCompare.call($button);
		} else {
			try {
				ga('send', 'event', 'Compare', 'AddItem', itemName);
	    	}  catch(err) {}
			addToCompare.call($button);
			document.compare.put({
				id: itemId,
				error: $.proxy(removeFromCompare, $button)
			});
		}
	};
	
	var methods = {
		init : function (settings) {
			$.extend(true, options, defaultOptions, settings);
			
			return this.each(function () {
				var $this = $(this);
				document.compare.bind('reset', function () {
					if (document.compare.isItemExists(this.data('item-id'))) {
						addToCompare.call(this);
					}
				}, $this);
				document.compare.bind('item:removed', function (id) {
					if (this.data('item-id') == id) {
						removeFromCompare.call(this);
					}
				}, $this);
				$this.bind('click.kuvaldaCompareButton', click);
			});
		},
		destroy: function () {
			return this.each(function () {
				var $this = $(this);
				$this.unbind('.kuvaldaCompareButton');
			});
		}
	};
	
	$.fn.kuvaldaCompareButton = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || ! method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  method + ' does not exist on jQuery.kuvaldaCompareButton');
		}
	};
})( jQuery );

(function( $ ) {
	var defaultOptions = {};
	var options = {};
	
	var show = function () {
		var item = document.compare.getItem(this.data('item-id'));
		var count = document.compare.getItemSimilarCount(this.data('item-id'));
		
		this.find('span').text('Сравнить с ' + count + ' ' + Utils.getPlural(count, ['другим', 'другими', 'другими']));
		if (item) {
			this.attr('href', item.compareUrl());
		}
		
		if (count) {
			this.show();
		}
	};
	var hide = function () {
		this.hide();
	};
	
	var methods = {
		init : function (settings) {
			$.extend(true, options, defaultOptions, settings);
			
			return this.each(function () {
				var $this = $(this);
				document.compare.bind('reset', function () {
					if (document.compare.isItemExists(this.data('item-id'))) {
						show.call(this);
					}
				}, $this);
				document.compare.bind('item:removed', function (id) {
					if (this.data('item-id') == id) {
						hide.call(this);
					}
				}, $this);
				document.compare.bind('item:added', function (id) {
					show.call(this);
				}, $this);
			});
		},
		destroy: function () {
			return this.each(function () {
				var $this = $(this);
			});
		}
	};
	
	$.fn.kuvaldaCompareLink = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || ! method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  method + ' does not exist on jQuery.kuvaldaCompareLink');
		}
	};
})( jQuery );

$(document).ready(function () {
	if (1) {
		$('.compare-container').kuvaldaCompareTable();
	}
	$('.compare-list').kuvaldaCompareList();
	$('.js-compare').kuvaldaCompareButton();
	$('.js-compare-link').kuvaldaCompareLink();
});

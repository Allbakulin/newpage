(function ($) {
    $.simple = $.simple || {};
    $.simple.gallery = {
		options: {
			itemWidth:		600,
			titleSelector:	'title',
			hasVideo:		false
		}
    };
    $.fn.simpleGallery = function (options) {
        var options = $.extend({}, $.simple.gallery.options, options);
        this.each(function () {
            $(this).data('simple-gallery', new Gallery($(this), options));
        });
        return this;
    };
	$.fn.simpleGalleryUpdate = function(photo) {
        return $(this).data('simple-gallery').update(photo);
    };
	
    function Gallery(root, options) {
		var objSelf = this,
			objRoot = root,
			objList,
			objNavPrev,
			objNavNext,
			objData,
			
			params = {},
			margin = {};
        

        function initialize() {
			objList = $('ul', root);
			objNavPrev = $('<div>').addClass('arrow').addClass('arrow-prev');
			objNavNext = $('<div>').addClass('arrow').addClass('arrow-next');
			objData = $('.photo-data', root);
			
			$('.photo-rating', objData)
				.append(
					$('<div>').addClass('stat-rating')
				)
				.append(
					$('<div>').addClass('stat-value')
				);
			
			root.append(objNavPrev);
			root.append(objNavNext);
			
			params.itemsTotal = $('li', objList).length;
			params.currentIndex = 0;
			params.resetFlag = 0;
			
			objList.css({width: options.itemWidth*params.itemsTotal});
			
			events();
			
			setData(false);
			
			return objSelf;
        }
		
		this.update = function(photo) {
			if (photo != 0) {
				var li = $('li[data-id="'+photo+'"]', objList);
				params.currentIndex = li.index();
				rewind();
				setData(true);
			} else {
				setData(false);
			}
        }
		
		function events() {
			objNavPrev.bind('click', prev);
			objNavNext.bind('click', next);
        }
		
		function prev(e) {
			params.currentIndex--;
			if (params.currentIndex == -1) {
				var li = $('li:last-child', objList);
				objList.prepend(li).css({marginLeft: (-1)*options.itemWidth});
				params.currentIndex = 0;
				params.resetFlag = -1;
			}
			animate();
			
			return false;
        }
		
		function next(e) {
			params.currentIndex++;
			if (params.currentIndex == params.itemsTotal) {
				var li = $('li:first-child', objList);
				objList.append(li).css({marginLeft: (-1)*(params.itemsTotal-2)*options.itemWidth});
				params.currentIndex = params.itemsTotal-1;
				params.resetFlag = 1;
			}
			animate();
			
			return false;
        }
		
		
		function resetPrev() {
			params.currentIndex = params.itemsTotal-1;
			var li = $('li:first-child', objList);
			objList.append(li).css({marginLeft: (-1)*params.currentIndex*options.itemWidth});
		}
		function resetNext() {
			params.currentIndex = 0;
			var li = $('li:last-child', objList);
			objList.prepend(li).css({marginLeft: (-1)*params.currentIndex*options.itemWidth});
		}
		
		function animate() {
			objList.animate(
				{marginLeft: (-1)*params.currentIndex*(options.itemWidth)},
				{duration: 500, easing: 'easeOutSine', complete: animateComplete}
			);
		}
		
		function rewind() {
			objList.css(
				{marginLeft: (-1)*params.currentIndex*(options.itemWidth)}
			);
		}
		
		function animateComplete() {
			if (params.resetFlag == -1) resetPrev();
			if (params.resetFlag == 1) resetNext();
			params.resetFlag = 0;
			if (options.hasVideo) {
				$('li', objList).removeClass('with-video');
				$('.youtube', objList).remove();
			}
			setData(true);
		}
		
		function setData(setHash) {
			var li = $('li', objList).eq(params.currentIndex);
			if (li.length) {
				if ($(options.titleSelector).length) {
					var name = li.data('author');
					$(options.titleSelector).html(
						((name.indexOf(' ') == -1)?name:'<span>'+name.replace(' ', '</span>'))
					);
				}
				$('.photo-share', objData).data({
					summary:	li.data('summary'),
					title:		li.data('title'),
					url:		li.data('url'),
					image:		li.data('image')
				});
				
				if (li.data('rating') > 0) {
					$('.photo-rating', objData).show();
					$('.stat-rating', objData).data('stars', li.data('stars')).statRating();
					$('.stat-value', objData).html(li.data('rating'));
				} else {
					$('.photo-rating', objData).hide();
				}
				
				if (setHash) window.location.hash = li.data('url');
				
				/*if (options.hasVideo) {
					if ($('.photo-preview>.youtube', li).length == 0) {
						var youtubeBlock = $('<div>').addClass('youtube');
						$('.photo-preview', li).append(youtubeBlock);
						youtubeBlock.html('<iframe width="480" height="360" src="'+li.data('video')+'" frameborder="0" allowfullscreen></iframe>');
						li.addClass('with-video');
					}
				}*/
				if (options.hasVideo) {
					$('.photo-preview', li).bind('click', function() {
						if ($('.youtube', $(this)).length == 0) {
							var youtubeBlock = $('<div>').addClass('youtube');
							$(this).append(youtubeBlock);
							youtubeBlock.html('<iframe width="480" height="360" src="'+li.data('video')+'" frameborder="0" allowfullscreen></iframe>');
						}
						$(this).parents('li').addClass('with-video');
					})
				}
			}
		}
		
        return initialize();
    };
})(jQuery);
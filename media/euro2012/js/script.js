/*
 * If you have any questions or comments about this script or if you'd like to report a bug please contact ask.dev at gmail.com
 */
$(document).ready(onReady);
$(window).bind('resize', onResize);

var sawResizeTimout = false, sawRotateTimeout = false, sawAutoRotateTimeout = false, sawCheckInterval = false,
    sawRotateFrame = 0, sawSkipOffset = -1,
    lastScrollTop = 0, lastScrollLeft = 0,
    
    patriotImagesArraySrc = [
        'forest-left.jpg', 'forest-right.jpg',
        'plank.jpg',
        'saw.png', 'saw-shadow.png', 'saw-sprite.png',
        'cut.png', 'cut-end.png',
		'dust.png',
        
        'burn/dot-big.png', 'burn/dot-small.png', 'burn/line.png', 'burn/curve.png',
        'burn/about.jpg', 'burn/euro.jpg',
        'burn/cup.png', 'burn/photo.png',
        
        'title/jury.png', 'title/stat.png'
    ],
    patriotImagesArrayLoad = [],
    patriotImagesCountTotal = patriotImagesArraySrc.length,
    patriotImagesCountLoad = 0;
    
function onReady() {
    navInit();
    patriotLoad();
    countdownInit();
    scrollTextInit();
    galleryInit();
    formInit();
    shareInit();
    popupInit();
	footerReset(true);
}
function onResize() {
    sawContainerReset(true);
	footerReset(true);
    //scrollTextResize();
}

function footerReset(abs) {
	if (navigator.platform == 'iPad' || navigator.platform == 'iPhone') {
		if (abs) {
			$('footer').css({
				position:	'absolute',
				bottom:		'auto',
				top:		window.pageYOffset+$(window).height()-78
			});
		} else {
			$('footer').css({
				position:	'fixed',
				bottom:		0,
				top:		'auto'
			});
		}
	}
}


function patriotLoad() {
    for (i=0;i<patriotImagesCountTotal;i++) {
        patriotImagesArrayLoad[i] = new Image();
        patriotImagesArrayLoad[i].onload = function() {
            patriotImagesCountLoad++;
            if (patriotImagesCountLoad == patriotImagesCountTotal) {
                setTimeout(patriotStart, 200);
            }
        }
        patriotImagesArrayLoad[i].src = DATA_URL + 'img/'+patriotImagesArraySrc[i];
    }
}

function patriotStart() {
	$('#saw').append('<div id="dust"></div>');
	
    $('#loader').remove();
    $('#container').addClass('loaded');
    $(window).scrollTo(0, {onAfter: function(){footerReset(true);}});
	
    $('#content').show();
    $('#page-about .burn-pic').show();
    
    setTimeout(sawStartShow, 500);
}
function sawStartShow() {
    $('#cut')
        .css({height: 0, paddingTop: 0})
        .show()
        .animate({paddingTop: '285px'}, {duration: 500, easing: 'linear'});
        
    $('#saw-container').addClass('hidden');
    sawContainerReset(false);
    
    sawAutoRotateTimeout = setInterval(sawAutoRotate, 50);
    $('#saw-container')
        .css({top: '-260px'})
        .show()
        .animate({top: '25px'}, {duration: 500, easing: 'linear', complete: sawStartComplete});
}
function sawAutoRotate() {
    sawDoRotate(false);
}
function sawStartComplete() {
    clearInterval(sawAutoRotateTimeout);
    sawFinishRotate();
    setTimeout(contentStartShow, 500);
}
function contentStartShow() {
    sawStartInit();
    
    $('body').css({overflow:'visible'});
    patriotStartComplete();
}
function patriotStartComplete() {
    $('#page-about .burn-dot-big').show();
    $('#page-about .burn-line').show();
	$('#page-about .finished').fadeIn(500);
    $('#page-about .cols').fadeIn(500);
    
    $('#content').addClass('vis');
    
    ratingInit();
    stageInit();
    setTimeout(navStart, 200);
}

function sawContainerReset(timer) {
    if ($(window).width() < 980) {
        clearTimeout(sawResizeTimout);
        if (!$('#saw-container').hasClass('hidden')) {
            $('#saw-container')
                .addClass('hidden')
                .animate({width: 0}, {duration: 250, easing: 'linear'});
        }
    
        $('#saw-container').css({
            right:  ($(window).width()-$('#cut').offset().left+$(window).scrollLeft()-5)+'px'
        });
        if (timer) sawResizeTimout = setTimeout(sawContainerShow, 500);
    } else {
        $('#saw-container').css({
            right:  '50%'
        });
    }
}
function sawContainerShow() {
    $('#saw-container')
        .stop()
        .css({width: 0})
        .animate({width: '162px'}, {duration: 250, easing: 'linear', complete: function(){
            $('#saw-container').removeClass('hidden');
        }});
}

function sawStartInit() {
    $('#saw-container').removeClass('hidden');
	
	$(window).scroll(sawStartRotate);
    if ('ontouchend' in document) {
		$(window).bind('touchmove', sawStartPadRotate);
	} else {
		$(window).mousewheel(function(e, delta){
			if (delta < 0) {
				if ($(window).scrollTop() == $(document).height() - $(window).height()) sawDoRotate(true);
			}
		});
	}
	
    //sawContainerReset(true);
}
function sawStartRotate() {
	var curCutHeight = $('#cut').height(),
        newCutHeight = $(window).scrollTop();
    
    if (newCutHeight > curCutHeight) $('#cut').css({height: newCutHeight});
    
    if (lastScrollTop < $(window).scrollTop()) {
        if (sawSkipOffset == -1 || sawSkipOffset != lastScrollTop) {
            sawDoRotate(true);
            sawSkipOffset = -1;
        }
    }
    navReset(false);
    lastScrollTop = $(window).scrollTop();
	
    if (lastScrollLeft != $(window).scrollLeft()) sawContainerReset(true);
    lastScrollLeft = $(window).scrollLeft();
	//footerReset(true);
}
function sawStartPadRotate() {
	var curCutHeight = $('#cut').height(),
        newCutHeight = window.pageYOffset;
    
    if (newCutHeight > curCutHeight) $('#cut').css({height: newCutHeight});
    
    if (lastScrollTop < window.pageYOffset) {
        if (sawSkipOffset == -1 || sawSkipOffset != lastScrollTop) {
            sawDoRotate(true);
            sawSkipOffset = -1;
        }
    }
    navReset(false);
    lastScrollTop = window.pageYOffset;
	footerReset(false);
}

function sawFinishRotate() {
    $('#saw').css({backgroundPosition: '0px 0px'}).removeClass('rotate');
}
function sawDoRotate(autofinish) {
    $('#saw')
        .css({
            top: (Math.floor(Math.random()*11) - 5)+'px',
            backgroundPosition: '0px '+(sawRotateFrame*-306)+'px'
        })
        .addClass('rotate');
	
	$('#dust')
        .css({
            backgroundPosition: '0px '+(sawRotateFrame*-80)+'px'
        })
    
    sawRotateFrame++;
    if (sawRotateFrame == 4) sawRotateFrame = 0;
    clearTimeout(sawRotateTimeout);
    if (autofinish) sawRotateTimeout = setTimeout(sawFinishRotate, 200);
}

function ratingInit() {
    $('.stat-rating').each(function() {
        $(this).statRating();
    });
}
$.fn.statRating = function() {
    var starsFill = parseInt($(this).data('stars')),
        starSpan = $('<span>'),
        starSpanFill = $('<span>').addClass('fill');
    $(this).empty();
    for (var i=0;i<5;i++) {
        if (starsFill > i) $(this).append(starSpanFill.clone());
        else $(this).append(starSpan.clone());
    }
}

function navInit() {
    $('nav').addClass('enabled');
    $('nav a').bind('click', function() {
        if ($('nav').hasClass('enabled')) {
            if ($(this).attr('href') == '#prizes') {
            
            } else {
                navScroll($(this).attr('href'), {duration: 500, easing:'easeOutSine'});
            }
        }
        return false;
    });
}
function navStart() {
    if (window.location.hash != '' && window.location.hash != '#') {
        var hash = window.location.hash;
        if (hash.indexOf('/') != -1) {
            var hashArray = hash.split('/');
            
            navScroll(hashArray[0], 0);
            lastScrollTop = $(window).scrollTop();
            
            if (hashArray.length > 2) {
                if (hashArray[1] == 'gallery' && hashArray[2] != 0) {
                    var galleryFound = false;
                    $('#page-stages .popup-show[data-popup="gallery"]').each(function(){
                        if ($(this).data('gallery') == hashArray[2]) {
                            galleryFound = true;
                            $(this).click();
                        }
                    });
                    if (galleryFound && hashArray.length > 3 &&  hashArray[3] != 0) {
                        var galleryElem = $('#popup .photo-gallery[data-gallery="'+hashArray[2]+'"]');
                        $('li>span', galleryElem).each(function(){
                            if ($(this).data('photo') == hashArray[3]) {
                                $(this).click();
                            }
                        });
                    }
                }
            }
            
        } else {
            navScroll(hash, 0);
            lastScrollTop = $(window).scrollTop();
        }
    }
	pagePrepare('stages');
	pagePrepare('jury');
	pagePrepare('stat');
}
function navScroll(page, params) {
    page = page.substr(1);
    if ($('#page-'+page).length) {
        sawSkipOffset = $('#page-'+page).offset().top;
		footerReset(false);
		params.onAfter = function() {footerReset(true);};
        $(window).scrollTo($('#page-'+page), params);
		trackUrl(page);
    }
}
function navReset(full) {
    var len = $('nav a').length,
        anchor, href;
    
    $('nav a').removeClass('active');
    
    if ($(window).scrollTop() == $(document).height() - $(window).height()) {
        window.location.hash = '#euro';
		trackUrl('euro');
    } else {
        for (i=0;i<len;i++) {
            href = $('nav a').eq(i).attr('href').substr(1);
            if ($('#page-'+href).length && $('#page-'+href).offset().top-$(window).height()/3 <= $(window).scrollTop()) {
                anchor = $('nav a').eq(i);
                //pagePrepare(href);
            }
        }
        if (anchor !== undefined) {
            anchor.addClass('active');
            if (full || window.location.hash.indexOf(anchor.attr('href')) == -1) {
				window.location.hash = anchor.attr('href');
				trackUrl(anchor.attr('href').substr(1));
			}
        }
    }
}

function pagePrepare(href) {
    if (href == 'stages') {
        if ($('.stage-opened').length == 0) {
            $('.stage-frame').eq(0).click();
        }
    }
    if (href == 'jury') {
		var h = (660 - $('#page-jury .page-content').outerHeight() - 100);
		$('#page-jury .burn-line-bot').css({height: (h > 278)?278:h});
    }
	if (href == 'stat') {
		var h = (660 - $('#page-stat .page-content').outerHeight() - 100);
		$('#page-stat .burn-line').css({height: (h > 278)?278:h});
    }
}

function stageInit() {
    $('.stage-frame').bind('click', stageFrameClick);
}
function stageFrameClick() {
    if (!$(this).parents('.stage').hasClass('stage-opened') && !$(this).parents('.stage').hasClass('stage-disabled')) {
        stageClose();
        $(this).parents('.stage').addClass('stage-opening');
        $('.stage-opening').animate({
            height: 330
        }, {
            duration:   500,
            easing:     'linear',
            complete:   stageOpened
        });
        $(this).animate({
            width:  193,
            height: 213,
            top:    7
        }, {
            duration:   500,
            easing:     'linear'
        });
    }
}
function stageOpened() {
    $('.stage-opening').removeClass('stage-opening').addClass('stage-opened');
    $('.stage-opened .stage-content').fadeIn(500);
}
function stageClose() {
    if ($('.stage-opened').length) {
        $('.stage-opened')
            .removeClass('stage-opened')
            .addClass('stage-closing');
        $('.stage-closing .stage-content').fadeOut(500);
        $('.stage-closing')
            .animate({
                height: 170
            }, {
                duration:   500,
                easing:     'linear',
                complete:   stageClosed
            });
        $('.stage-closing .stage-frame')
            .animate({
                width:  138,
                height: 152,
                top:    15
            }, {
                duration:   500,
                easing:     'linear'
            });
    }
}
function stageClosed() {
    $('.stage-closing').removeClass('stage-closing');
}



function galleryInit() {
    $('.photo-gallery-preview').each(function() {
        $(this).simpleGallery({itemWidth: 540, titleSelector: '#popup-title', hasVideo: ($(this).hasClass('video-gallery'))});
    });
}



function popupInit() {
    $('#popup .close').bind('click', popupClose);
    $('.popup-show').bind('click', popupOpen);
    $('.popup-hide').bind('click', popupClose);
}
function popupOpen() {
    //if (!$('#popup').hasClass('active')) {
    popupHide();
    popupShow({
        name: $(this).data('popup'),
        stage: $(this).data('stage'),
        gallery: $(this).data('gallery'),
        photo: $(this).data('photo')
    });
    //}
	
	var url = $(this).data('popup');
	if (url == 'gallery' || url == 'gallery-preview') url += $(this).data('gallery');
	trackUrl(url);
}
function popupShow(params) {
    if ($('#popup-'+params.name).length) {
		var popupElement = $('#popup-'+params.name);
        popupElement.show();
        $('#popup-title').html(popupElement.data('title'));
        if (popupElement.data('subtitle') != '') $('#popup-subtitle').html(popupElement.data('subtitle')).show();
        else $('#popup-subtitle').hide();
        $('#popup').addClass('active');
        
        if (params.name == 'gallery') {
            popupGalleryInit(params);
        }
        if (params.name == 'gallery-preview') {
            popupGalleryPreviewInit(params);
            $('#popup .back').data({popup: 'gallery', gallery: params.gallery}).show();
        }
        if (params.name == 'reg') {
            $('#popup .back').data({popup: 'auth'}).show();
        }
        if (popupElement.hasClass('popup-contest-photo')) {
            popupContestPhotoInit(params);
        }
        if (popupElement.hasClass('popup-contest-video')) {
            popupContestVideoInit(params);
        }
        if (params.name == 'contest-res') {
            popupContestResInit(params);
        }
        
        $('#popup').fadeIn(250, function() {
            scrollTextReset();
        });
    }
}
function popupClose() {
	var objList = $('.video-gallery>.photo-wrapper>ul');
	$('li', objList).removeClass('with-video');
	$('.youtube', objList).remove();
	
    $('#popup').fadeOut(250, function() {
        popupHide();
        navReset(true);
        $('#popup').removeClass('active');
    });
}
function popupHide() {
    $('.popup-content').hide();
    $('#popup .back').hide();
    scrollTextDisable();
}



function popupGalleryInit(params) {
    $('#popup-gallery .photo-gallery').hide();
    $('#popup-gallery .photo-gallery[data-gallery="'+params.gallery+'"]').show();
}
function popupGalleryPreviewInit(params) {
    $('#popup-gallery-preview .photo-gallery-preview').hide();
    $('#popup-gallery-preview .photo-gallery-preview[data-gallery="'+params.gallery+'"]').show();
    $('.photo-gallery-preview[data-gallery="'+params.gallery+'"]').simpleGalleryUpdate(params.photo);
}



function popupContestPhotoInit(params) {
    $('#popup-'+params.name+' button').data({stage: params.stage});
    
    var percentVal = '0%';
    $('#popup-'+params.name+' .progress span').width(percentVal);
    $('#popup-'+params.name+' .progress h3').html(percentVal);
	
    $('#popup-'+params.name+' .form-text').show();
    $('#popup-'+params.name+' .form-result').hide();
}
function popupContestVideoInit(params) {
    $('#popup-'+params.name+' button').data({stage: params.stage});
    
    $('#popup-'+params.name+' .form-text').show();
    $('#popup-'+params.name+' .form-result').hide();
}
function popupContestResInit(params) {
    $('#popup-contest-res .contest-result').hide();
    $('#popup-contest-res .contest-result[data-stage="'+params.stage+'"]').show();
}


//scroll

function scrollTextInit() {
    if ($('.scroll-text').length) {
        $('.scroll-text').each(function() {
            $(this)
                .wrapInner('<div class="overview"/>')
                .wrapInner('<div class="viewport"/>')
                .prepend('<div class="scrollbar"><div class="track"><div class="thumb"></div></div></div>');
        });
        $('.scroll-text').tinyscrollbar({wheel: 50, sizethumb: 41});
    }
}
function scrollTextReset() {
    if ($('.scroll-text').length) {
        $('.scroll-text').each(function() {
            $(this).tinyscrollbar_update(0);
        });
    }
}
function scrollTextDisable() {
    if ($('.scroll-text').length) {
        $('.scroll-text').each(function() {
            $(this).tinyscrollbar_update(0);
            $('.scrollbar', $(this)).addClass('disable');
        });
    }
}
function scrollTextResize() {
    if ($('.scroll-text').length) {
        $('.scroll-text').each(function() {
            $(this).tinyscrollbar_update('relative');
        });
    }
}

//form
function formInit() {
    if ($('form').length) {
        $('input[placeholder]').placeholder();
        $('#popup .form-button button').bind('click', formSubmit);
        
        $('.form-field input')
            .bind('keyup', formFieldReset)
            .bind('blur', formFieldReset);
        
        $('.checkbox-required')
            .bind('click', function() {
                $(this).parents('span').removeClass('invalid');
            });
    }
}
function formSubmit() {
    var submitButton = $(this),
        formElement = submitButton.parents('.popup-content'),
        formValid = true, canSubmit = true,
        formRequiredSupport = (!($.browser.webkit && !window.chrome) && !!('required' in document.createElement('input'))),
        formId = formElement.attr('id');
        
    if (formElement.hasClass('popup-contest-photo')) {
        photoUpload({
            formid: formId,
            stage:  submitButton.data('stage')
        });
    } else if (formElement.hasClass('popup-contest-video')) {
        $('input', formElement).each(function() {
            if ($(this).hasClass('invalid')) {
                formValid = false;
                canSubmit = false;
            } else if ($(this).val() == '') {
                $(this).addClass('invalid');
                formValid = false;
            }
        });
    
        if (formValid) {
            var formParams = $('form', formElement).serialize();
                formParams += '&formid='+formId;
                formParams += '&stage='+submitButton.data('stage');
            
            $('.form-button', formElement).addClass('form-loading');
            $.post('/_terminal/promo/euro2012/file/', formParams, formSubmitPhotoResult, 'json');
			//$.post('file.php', formParams, formSubmitPhotoResult, 'json');
        }
    } else {    
        $('input', formElement).each(function() {
            cloned = ($(this).next('input').attr('name') == $(this).attr('name'));
            if ($(this).hasClass('invalid')) {
                formValid = false;
                canSubmit = false;
            } else if ($(this).val() == '' || (($(this).val() == $(this).attr('placeholder')) && !cloned) ) {
                $(this).addClass('invalid');
                formValid = false;
            } else if ($(this).hasClass('email')) {
                if (!formTestEmail($(this).val())) {
                    $(this).addClass('invalid');
                    formValid = false;
                }
            } else if ($(this).hasClass('checkbox-required') && !$(this).attr('checked')) {
                $(this).parents('span').addClass('invalid');
                formValid = false;
            }
        });
    
        if (formValid) {
            var formParams = $('form', formElement).serialize();
                formParams += '&formid='+formId;
            
            $('.form-button', formElement).addClass('form-loading');
            
            $.post('/_terminal/promo/euro2012/auth/', formParams, formSubmitResult, 'json');
			//$.post('auth.php', formParams, formSubmitResult, 'json');
        }
    }
    return false;
}

function formSubmitResult(data, status) {
    if (data.formid != '' && $('#'+data.formid).length) {
        var formElement = $('#'+data.formid);
        $('.form-button', formElement).removeClass('form-loading');
        
        if (data.errors && data.errors !== undefined) {
            var fieldName;
            for (i in data.errors) {
                fieldName = i;
                $('input[name='+fieldName+']', formElement).addClass('invalid');
            }
			if (data.errors.message && data.errors.message !== undefined) {
				$('.form-error', formElement).html(data.errors.message).show();
			} else {
				$('.form-error', formElement).hide();
			}
        } else {
			$('.form-error', formElement).hide();
            if (data.formid == 'popup-auth') {
                window.location.replace(BASE_URL);
            }
            if (data.formid == 'popup-reg') {
                popupHide();
                $('#popup-reg-ok').data({title: ((data.name.indexOf(' ') == -1)?data.name:'<span>'+data.name.replace(' ', '</span>'))})
                popupShow({name: 'reg-ok'});
            }
        }
    }
}
function formSubmitPhotoResult(xhr) {
    if (xhr.responseText) eval('var data='+xhr.responseText);
    else data = xhr;
    
    if (data.formid != '' && $('#'+data.formid).length) {
        var formElement = $('#'+data.formid);
        $('.form-button', formElement).removeClass('form-loading');
        
        if (formElement.hasClass('popup-contest-photo')) {
            var percentVal = '100%';
            $('.progress span', formElement).width(percentVal);
            $('.progress h3', formElement).html(percentVal);
        }
        if (formElement.hasClass('popup-contest-video')) {
            
        }
		//
		if (data.errors && data.errors !== undefined) {
            if (data.errors.message && data.errors.message !== undefined) {
				$('.form-error', formElement).html(data.errors.message).show();
			} else {
				$('.form-error', formElement).hide();
			}
        } else {
			$('.form-error', formElement).hide();
			$('#page-stages .button[data-stage="'+data.stage+'"]').hide();
			$('.form-text', formElement).hide();
			$('.form-result', formElement).fadeIn(250);
		}
		//
       
    }
}

function formEmailConfirm(name) {
    $('#popup-email-ok').data({title: ((name.indexOf(' ') == -1)?name:'<span>'+name.replace(' ', '</span>'))})
    popupShow({name: 'email-ok'});
}

function formFieldReset() {
    if ($(this).val() != '') {
        if ($(this).hasClass('email')) {
            if (formTestEmail($(this).val())) {
                $(this).removeClass('invalid');
            }
        } else {
            $(this).removeClass('invalid');
        }
    }
}
function formTestEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}


//upload
function photoUpload(params) {
	$('#'+params.formid+' form').ajaxForm({
		dataType: "json",
		beforeSend: function() {
			var percentVal = '0%';
			$('#'+params.formid+' .progress span').width(percentVal);
			$('#'+params.formid+' .progress h3').html(percentVal);
		},
		uploadProgress: function(event, position, total, percentComplete) {
			var percentVal = percentComplete + '%';
			$('#'+params.formid+' .progress span').width(percentVal)
			$('#'+params.formid+' .progress h3').html(percentVal);
		},
		complete: formSubmitPhotoResult
	});
    for (name in params) {
        if ($('#'+params.formid+' form input[name="'+name+'"]').length == 0) {
            $('#'+params.formid+' form')
                .append(
                    $('<input type="hidden" name="'+name+'" value="'+params[name]+'">')
                );
        } else {
            $('#'+params.formid+' form input[name="'+name+'"]').val(params[name]);
        }
    }
    $('#'+params.formid+' form').attr('action', '/_terminal/promo/euro2012/file/');
	//$('#'+params.formid+' form').attr('action', 'file.php');
    $('#'+params.formid+' .form-button').addClass('form-loading');
    
    $('#'+params.formid+' form').submit();
}



function countdownInit() {
    $.countdown.regional['ru'] = {
        labels: ['ËÅÒ', 'ÌÅÑßÖÅÂ', 'ÍÅÄÅËÜ', 'ÄÍÅÉ', '×ÀÑÎÂ', 'ÌÈÍÓÒ', 'ÑÅÊÓÍÄ'],
        labels1: ['ÃÎÄ', 'ÌÅÑßÖ', 'ÍÅÄÅËß', 'ÄÅÍÜ', '×ÀÑ', 'ÌÈÍÓÒÀ', 'ÑÅÊÓÍÄÀ'],
        labels2: ['ÃÎÄÀ', 'ÌÅÑßÖÀ', 'ÍÅÄÅËÈ', 'ÄÍß', '×ÀÑÀ', 'ÌÈÍÓÒÛ', 'ÑÅÊÓÍÄÛ'],
        compactLabels: ['l', 'm', 't', 'd'], compactLabels1: ['r', 'm', 't', 'd'],
        whichLabels: function(amount) {
            var units = amount % 10;
            var tens = Math.floor((amount % 100) / 10);
            return (amount == 1 ? 1 : (units >= 2 && units <= 4 && tens != 1 ? 2 : (units == 1 && tens != 1 ? 1 : 0)));
        },
        timeSeparator: ':',
        isRTL: false
    };
    $.countdown.setDefaults($.countdown.regional['ru']);
    
    $('.stage-time').each(function() {
    	var stageCountdownDate = $('.stage-countdown', $(this)).text().split('-'),
			expDate = new Date(parseInt(stageCountdownDate[0]), parseInt(stageCountdownDate[1])-1, parseInt(stageCountdownDate[2]), parseInt(stageCountdownDate[3]), parseInt(stageCountdownDate[4]), parseInt(stageCountdownDate[5]));
			layout = '{dn} {dl} / {hn} {hl} / {mn} {ml}';
    	
    	$('.stage-countdown', $(this)).countdown({
            until : expDate,
            layout: layout,
            regional : 'ru',
            onTick: function() {return null; window.location.reload();}, 
            tickInterval: 60*60
        });
    	
        
    });
}

//share
function shareInit() {
    $('.share-block .ico-share span').bind('click', shareClick);
}
function shareClick(){
    
    var shareBlock = $(this).parents('.share-block'),
        social = $(this).data('social'),
        dataShare = {
            summary:    shareBlock.data('summary'),
            title:      shareBlock.data('title'),
            url:        shareBlock.data('url'),
            image:      shareBlock.data('image')
        };
    dataShare.url = (dataShare.url.indexOf('http://')==-1)?(BASE_URL+dataShare.url):dataShare.url;
    dataShare.image = (dataShare.image.indexOf('http://')==-1)?(BASE_URL+dataShare.image):dataShare.image;
    
    var url = '';
    if (social == 'facebook') {
        url = "http://www.facebook.com/sharer.php?s=100"
                +"&p[title]="+encodeURIComponent(dataShare.title)
                +"&p[summary]="+encodeURIComponent(dataShare.summary)
                +"&p[url]="+encodeURIComponent(dataShare.url)
                +"&p[images][0]="+encodeURIComponent(dataShare.image);
    }
    if (social == 'vkontakte') {
        url = "http://vkontakte.ru/share.php?"
                +"title="+encodeURIComponent(dataShare.title)
                +"&description="+encodeURIComponent(dataShare.summary)
                +"&url="+encodeURIComponent(dataShare.url);
    }
    if (social == 'twitter') {
        url = "http://twitter.com/share?"
                +"text="+encodeURIComponent(dataShare.title)
                +"&url="+encodeURIComponent(dataShare.url);
    }
    if (url != '') window.open(url,'','toolbar=0,status=0,width=600,height=400');
}


function trackUrl(url) {
	if (typeof(pageTracker) != 'undefined') pageTracker._trackPageview('/promo/euro2012/'+url+'/');
	//console.log(url);
}
$(function () {
	if (!$('.supplyDate').length) return;
	var $tooltip = $('#supplyDateTooltip');
	
	function show() {
		var $this = $(this); 
		$tooltip.css({left: $this.offset().left, top: $this.offset().top, width: $this.width()}).fadeIn(300);
	}
		
	function hide() {
		$tooltip.fadeOut(300);
	}
	
	$(document).on('mouseenter', '.supplyDate', show);
	$(document).on('mouseleave', '.supplyDate', hide);
	$tooltip.on('mouseleave', hide);
	$tooltip.on('mouseenter', function () {
		$tooltip.stop().css('opacity', 0.95);
	});
});

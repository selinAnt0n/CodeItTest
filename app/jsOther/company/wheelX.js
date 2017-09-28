function onWheelX(e) {
	event = arguments[1] || window.event;

		let delta = event.deltaY || event.detail || event.wheelDelta,
			holder = $(arguments[0]),
			inner = holder.find('.inner'),
			left = parseInt($(inner).css('left')),
			width = $(inner).width(),
			animTop = holder.find('.top-line-anim')
			animBot = holder.find('.bottom-line-anim'),
			scroll = holder.find('.scrollX'),
			procent = (($(holder).width() / width) * 100).toFixed(2),
			scrollwidth = Math.round(((procent * holder.width()  ) / 100));

			scroll.width(scrollwidth);


		if (width < $(holder).width()) {

		} else {
			if (delta > 0) {

				$(animTop).addClass('active');

				if ( -(left - delta) < (width - $(holder).width()) ) {
					$(inner).css({
						'left': left - delta + 'px'
					});
				} else {
					$(inner).css({
						'left': -(width - $(holder).width()) + 'px'
					});
				}

			} else if ( delta < 0) {

				if ( -(left - delta) <= 0 ) {

					$(inner).css({
						'left': 0 + 'px'
					});

				} else {
					$(inner).css({
						'left': left + ( -delta) + 'px'
					});
				}
			}
		}

		let procent2 = ((left / width) * 100).toFixed(2),
			topPos =  Math.round(((procent2 * holder.width()  ) / 100));

		scroll.css('left',-topPos);

	event.preventDefault ? event.preventDefault() : (event.returnValue = false);
}
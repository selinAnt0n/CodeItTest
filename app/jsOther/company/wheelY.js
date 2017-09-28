function onWheelY(e) {
	let event = arguments[1] || window.event;

		let holder = $(arguments[0]),
			inner = holder.find('.inner'),
			scroll = holder.find('.scrollY'),
			top = parseInt($(inner).css('top')),
			height = $(inner).height(),
			animTop = holder.find('.top-line-anim'),
			animBot = holder.find('.bottom-line-anim'),
			procent = (($(holder).height() / height) * 100).toFixed(2),
			scrollHeight = Math.round(((procent * holder.height()  ) / 100)),
			delta = event.deltaY || event.detail || event.wheelDelta;

		scroll.height(scrollHeight);

		if (height < holder.height()) {
			scroll.addClass('hide');
			return false;
		} else {
			scroll.removeClass('hide');
		}

		if (delta > 0) {

			$(animTop).addClass('active');

			setTimeout(() => {
			  $(animTop).removeClass('active');
			}, 600)


			if ( -top < (height - $(holder).height()) ) {

				$(inner).css({
					'top': top - delta + 'px'
				});

			} else {

				$(inner).css({
					'top': -(height - $(holder).height()) + 'px'
				});
			}

		} else if ( delta < 0) {

			$(animBot).addClass('active');

			setTimeout(() => {
			  $(animBot).removeClass('active');
			}, 600)

			if ( -(top) <= 0 ) {

				$(inner).css({
					'top': 0 + 'px'
				});

			} else {
				$(inner).css({
					'top': top + ( -delta) + 'px'
				});
			}
		}

		let procent2 = ((top / height) * 100).toFixed(2),
			topPos =  Math.round(((procent2 * holder.height()  ) / 100));

		scroll.css('top',-topPos);

	event.preventDefault ? event.preventDefault() : (event.returnValue = false);
}
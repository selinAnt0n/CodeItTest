function createTabs(holder) {

	if (holder.length == 0) {
		return false;
	}

	let button = holder.find("span"),
		ulLi = holder.find("li"),
		div = holder.find("div"),
		clickButton,
		selectsItem = '',
		clickSelect,
		backArr = [];

	clickButton = $(button).click(function() {

		if ($(div).hasClass('selectHolder-active')) {

			$(div).removeClass('selectHolder-active');
			button.removeClass('active');
			$(div).empty();

		} else {

			let allItem = $(ulLi);

			for (let i = 0;i < allItem.length;i++) {

				let span = $(document.createElement('span')),
					box = allItem[i],
					box2 = $(box).text();

				span.text(box2);
				$(div).append(span);

			}

			$(div).addClass('selectHolder-active');
			button.addClass('active');

		}
	})

	for (let j = 0; j < holder[0].classList.length;j++) {
		selectsItem += '.'+ holder[0].classList[j];
	}

	selectsItem += ' div span';

	clickSelect = $('body').on("click",selectsItem,function(e) {

		$(button).text($(e.target).text());
		$(div).removeClass('selectHolder-active');
		button.removeClass('active');
		$(div).empty();

	});

	backArr.push(clickButton);
	backArr.push(clickSelect);
	return backArr;

}

// ===========================
// Инициализация Select
// ===========================
createTabs($('.gender-holder'));
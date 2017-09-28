"use strict";

function upLoad() { // Начало построение страницы
	if (!$('.company').length) { // проверка на наличие holder
		return false;
	}
	let ulrArr = [
		{
			name:'company',
			url:'http://codeit.pro/frontTestTask/company/getList'
		},
		{
			name:'news',
			url:'http://codeit.pro/frontTestTask/news/getList'
		}],
		allCompany,
		allNews,
		sortButtons = $('.sort-holder button');

	function getData (url,name) {

		$.ajax({
			type: 'POST',
			url: url,
			success: function(data) {

				if (data.status == 'OK') {

					if (name == 'news') {

						allNews = data;
						createNews(allNews);

					} else {

						allCompany = data;
						createTotalCompanies(allCompany);
						createCompaniesLocation(allCompany);

					}

				} else {
					console.error(data.message);
				}

			},
			error:  function(xhr, str){
				console.error(xhr.responseCode);
			}
		}); // Получение данных

	}

	function createTotalCompanies (arr) { // Вывод количества компаний

		$('.total-companies span').text(arr.list.length);
		createListOpCompanies(arr);

	}

	function createListOpCompanies (arr) { // Вывод всех компаний

		let parent = $('.listOfCompanies'),
			holder = document.createElement('div'),
			elem = parent[0];

		$(holder).addClass('listOfCompanies-holder');
		$(holder).addClass('inner');

		if (elem.addEventListener) {
			if ('onwheel' in document) {
			// IE9+, FF17+, Ch31+
				elem.addEventListener("mousewheel", onWheelY.bind(window,parent));
			// elem.addEventListener("wheel", onWheelY);
			} else if ('onmousewheel' in document) {
			// устаревший вариант события
				elem.addEventListener("mousewheel", onWheelY.bind(window,parent));
			} else {
			// Firefox < 17
				elem.addEventListener("MozMousePixelScroll", onWheelY.bind(window,parent));
			}
		} else { // IE8-
			elem.addEventListener("onmousewheel", onWheelY.bind(window,parent));
		}

		for (let i = 0;i < arr.list.length;i++) {

			let itemBox = document.createElement('span');
			$(itemBox).text(arr.list[i].name);
			$(holder).append(itemBox);

		}

		parent.append(holder);
		let allChildren = $(holder).find('span');

		if ($(holder).height() > parent.height()) {
			$('.scrollY').addClass('active');
		}

		allChildren.on('click', function (e) {

			allChildren.removeClass('active');
			$(this).addClass('active');
			let activesortMode = {};
			activesortMode.sort = 'val';
			activesortMode.code = 2;

			for (let t =0;t < sortButtons.length;t++) {

				if ($(sortButtons[t]).hasClass('active')) {
					activesortMode.sort = $(sortButtons[t]).data('sort');
					if ( $(sortButtons[t]).hasClass('up') ) {
						activesortMode.code = 2;
					} else {
						activesortMode.code = 1;
					}
				}

			}

			sortButtons.off('click');
			createCompanyPartners(arr,allChildren.index($(this)),activesortMode.sort,activesortMode.code);

		})

	}

	function createCompanyPartners (arr,index,sortMod,sortCode) { // Построение процентов компаний партнёров

		let holder = $('.company-partners-inner'),
			globalHolder = $('.company-partners'),
			partners = arr.list[index].partners,
			box = $(document.createElement('div')),
			elem = globalHolder[0];

		$(globalHolder).addClass('active');
		$(holder).empty().addClass('inner');

		for (let i = 0;i < partners.length;i++) {

			let item = $(document.createElement('div')),
				val = $(document.createElement('span')).text(partners[i].value),
				name = $(document.createElement('strong')).text(partners[i].name);

			item.append(name,val);

			box.append(item);

		}

		let elems = $(box).find("div"),
			sortBox = $.makeArray(elems);

		sortBox = sortApp(sortCode,sortMod,sortBox);


		function sortApp(code,mod,arr) {

			if (mod == 'val') {

				if (code == 1) {

					return arr.sort(function(a, b) {

						return $(a).find("span").text() - $(b).find("span").text();

					});

				} else if (code == 2) {

					return arr.sort(function(a, b) {

						return  $(b).find("span").text() -$(a).find("span").text();

					});

				}

			} else {

				if (code == 1) {

					return arr.sort(function(a, b) {

						if ($(a).find("strong").text() > $(b).find("strong").text()) {
							return -1;
						}
						if ($(a).find("strong").text() < $(b).find("strong").text()) {
							return 1;
						}
						return 0;

					});

				} else if (code == 2) {

					return arr.sort(function(a, b) {

						if ($(a).find("strong").text() > $(b).find("strong").text()) {
							return 1;
						}
						if ($(a).find("strong").text() < $(b).find("strong").text()) {
							return -1;
						}
						return 0;

					});

				}

			}
		}

		holder.append(sortBox);

		if (elem) {
			if (elem.addEventListener) {
				if ('onwheel' in document) {
					// IE9+, FF17+, Ch31+
					elem.addEventListener("wheel", onWheelX.bind(window,elem));
				} else if ('onmousewheel' in document) {
					// устаревший вариант события
					elem.addEventListener("mousewheel", onWheelX.bind(window,elem));
				} else {
					// Firefox < 17
					elem.addEventListener("MozMousePixelScroll", onWheelX.bind(window,elem));
				}
			} else { // IE8-
				elem.attachEvent("onmousewheel", onWheelX.bind(window,elem));
			}
		}

		holder.width($(holder.children()).eq(1).width() * $(holder.children()).length);

		if (holder.width() > holder.parent().width()) {
			$('.scrollX').addClass('active');
		}

		$('.sortName').on('click', function () {

			holder.empty();
			sortButtons.removeClass('active');
			$(this).addClass('active');

			if ($(this).hasClass('up')) {

				$(this).removeClass('up').addClass('down');
				sortBox = sortApp(1,'name',sortBox);

			} else if ($(this).hasClass('down')){

				$(this).removeClass('down').addClass('up');
				sortBox = sortApp(2,'name',sortBox);

			} else {

				$(this).addClass('down');
				sortBox = sortApp(1,'name',sortBox);

			}

			holder.append(sortBox);

		});

		$('.sortVal').on('click', function () {

			holder.empty();
			sortButtons.removeClass('active');
			$(this).addClass('active');

			if ($(this).hasClass('up')) {

				$(this).removeClass('up').addClass('down');
				sortBox = sortApp(1,'val',sortBox);

			} else if ($(this).hasClass('down')){

				$(this).removeClass('down').addClass('up');
				sortBox = sortApp(2,'val',sortBox);

			} else {

				$(this).addClass('down');
				sortBox = sortApp(1,'val',sortBox);

			}

			holder.append(sortBox);

		}); 

	}

	function createCompaniesLocation (arr) { // Построение локаций компании

		let locationArr = [],
			assocArr = [],
			numbArr = [],
			arrForChart,
			buttonBack = $('.back');

		function search (arr,elem) { // Поиск индекса элемента на которого был клик

			return arr.indexOf(elem);

		}

		function buildArr (arr1,arr2,length) { // Построение массива для google chart

			let arr = [];

			for ( let i = 0;i < arr1.length;i++ ) {

				let percent = (arr2[i]/length) * 100;
				arr.push([arr1[i],percent]);

			}

			arr.unshift(['Country','Company']);
			return arr;

		}

		for (let i = 0;i < arr.list.length;i++) {

			if (assocArr.length == 0) {

				assocArr.push(arr.list[i].location.name);
				numbArr.push(1);

			} else {

				let index = search(assocArr,arr.list[i].location.name);

				if (index === -1) {

					assocArr.push(arr.list[i].location.name);
					numbArr.push(1);

				} else {

					numbArr[index]++;

				}
			}

		}

		arrForChart = buildArr(assocArr,numbArr,arr.list.length);
		google.charts.load('current', {'packages':['corechart']});
		google.charts.setOnLoadCallback(drawChart);

		function drawChart() {

			let data = google.visualization.arrayToDataTable(arrForChart);

			let options = {
				slices: {
					0: { color: '#999' },
					1: { color: '#9B4D4D' },
					2: { color: 'violet' }
				},
				width:'300px',
				height:'250px',
				tooltip: { trigger: 'none' },
			};

			let chart = new google.visualization.PieChart(document.getElementById('piechart'));

			chart.draw(data, options);

			function selectHandler() { // Событие на клик по chart

				let selectedItem = chart.getSelection()[0],
					parent = $('.hiddenCompany'),
					div = document.createElement('div'),
					elem = parent[0];

				$('#piechart').addClass('hide');
				parent.addClass('active');
				$(div).addClass('hiddenCompany-inner');
				$(div).addClass('inner');

				for (let i = 0; i < arr.list.length;i++) {

					let span = $(document.createElement('span'));

					if (arr.list[i].location.name == arrForChart[selectedItem.row + 1][0]) {

						span.text(arr.list[i].name);
						div.append(span[0]);

					}

				}

				$('.hiddenCompany').append(div);

				if (elem.addEventListener) { // Вешаем собитие скролла на выпадающий список компаний

					if ('onwheel' in document) {
					// IE9+, FF17+, Ch31+

						elem.addEventListener("mousewheel", onWheelY.bind(window,parent));
					// elem.addEventListener("wheel", onWheelY);
					} else if ('onmousewheel' in document) {
					// устаревший вариант события
						elem.addEventListener("mousewheel", onWheelY.bind(window,parent));
					} else {
					// Firefox < 17
						elem.addEventListener("MozMousePixelScroll", onWheelY.bind(window,parent));
					}

				} else { // IE8-
					elem.addEventListener("onmousewheel", onWheelY.bind(window,parent));
				}

			}

			google.visualization.events.addListener(chart, 'select', selectHandler);

		}
		buttonBack.on('click', () => {

			$('.hiddenCompany ').removeClass('active');
			$('.hiddenCompany-inner').remove();
			$('#piechart').removeClass('hide');

		}); 
	}

	function createNews(arr) { // Создание новостей

		let arrIn = arr.list,
			holder = $('.news-holder'),
			box = document.createElement('div'),
			nav = $(document.createElement('div')).addClass('nav-gallery'),
			formattedTime;

			function getDate (code) { // Построение даты

				let date = new Date(code*1000),
					year = date.getFullYear(),
					month = date.getMonth(),
					day = date.getDate();

				if ((day+ '').length < 2) {
					day = '0' + day;
				}
				if ((month + '').length < 2) {
					month = '0' + month;
				}

				formattedTime = day + '.' + month + '.' + year;
				return formattedTime;

			}

		for (let i = 0;i < arrIn.length;i++) { // Создание блока новости

			let newBox = $(document.createElement('div')),
				img = $(document.createElement('img')),
				author = $(document.createElement('strong')),
				title = $(document.createElement('h3')),
				date = $(document.createElement('span')),
				info = $(document.createElement('p')),
				link = $(document.createElement('a')),
				footerNews = $(document.createElement('div')),
				navGalleryButton = $(document.createElement('span'));

			if (i == 0) {

				newBox.addClass('active');
				navGalleryButton.addClass('active');

			}

			img.attr('alt','img-' + i);
			nav.append(navGalleryButton);
			author.text(arrIn[i].author);
			title.text(arrIn[i].author);
			link.append(title);
			img.attr('src',arrIn[i].img);
			info.text(arrIn[i].description);
			link.attr('href',arrIn[i].link);
			date.text( getDate(arrIn[i].date));

			footerNews.append(date,author).addClass('footer-news');

			newBox.append(img,link,info,footerNews).addClass('news-item');

			$(box).append(newBox);

		}

		nav.on('click','span',function () { // Собыие переключение слайдов

			let elem = $(this),
				allSlides = holder.find('.news-item'),
				allButtons = nav.find('span'),
				index = allButtons.index(this);

			allButtons.removeClass('active');
			elem.addClass('active');

			allSlides.removeClass('active');
			allSlides.eq(index).addClass('active');

		});

		holder.append(nav);
		holder.append(box); // Добавление новостей на страницу

	}

	for(let i = 0; i < ulrArr.length;i++) {

		getData(ulrArr[i].url,ulrArr[i].name);

	}

	$(window).bind('load', function() { // Скрытие прелоадеров
		$('.company-box').addClass('company-box-loaded');
	});

};

upLoad();
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
// =============================
// Валидация и отправка формы
// ============================
$('.send').on('click', function () {

	let parent = $(this).parent(),
		allInfo = {},
		errors = parent.find('.errors'),
		count;

	$(errors).empty();

	allInfo.name = parent.find('.name').val();
	allInfo.secondname = parent.find('.secondname').val();
	allInfo.email = parent.find('.email').val();
	allInfo.gender = parent.find('.gender').text();
	allInfo.pass = parent.find('.password').val();
	allInfo.privacy = parent.find('#privacy')[0].checked;

	count = Object.keys(allInfo).length;

	function addError (codeErr,textErr) { // Функция построения ошибки

		let span = $(document.createElement('span'));

		switch (codeErr) {
			case 1:
				span.text('Field "name" is required');
				break;
			case 2:
				span.text('Field "secondname" is required');
				break;
			case 3:
				span.text('Field "email" is required');
				break;
			case 4:
				span.text('Field "gender" is required');
				break;
			case 5:
				span.text('Field "pass" is required');
				break;
			case 6:
				span.text('You must agree with Privacy Notice');
				break;
			case 7:
				span.text('Error status = ' + textErr);
				break;
			case 8:
				span.text(textErr);
				break;
			default:
				console.error('I dont know what is wrong)');
		}

		return errors.append(span);

	}

	function checkForm () { // Валидация

		for (let key in allInfo) {
			switch (key) {
				case 'name':
					if (allInfo[key].length > 0) {
						count--;
					} else {
						addError(1);
					}
					break;
				case 'secondname':
					if (allInfo[key].length > 0) {
						count--;
					} else {
						addError(2);
					}
					break;
				case 'email':
					if (allInfo[key].length > 0) {
						count--;
					} else {
						addError(3);
					}
					break;
				case 'gender':
					if (allInfo[key].toLowerCase() == "famale" || allInfo[key].toLowerCase() == "male") {
						count--;
					} else {
						addError(4);
					}
					break;
				case 'pass':
					if (allInfo[key].length > 0) {
						count--;
					} else {
						addError(5);
					}
					break;
				case 'privacy':
					if (allInfo[key]) {
						count--;
					} else {
						addError(6);
					}
					break;
				default:
					console.error('allInfo broken');
			}
		}

	}

	checkForm();

	if (count == 0) { // Запрос

		var msg = $.param(allInfo,true);

		$.ajax({
			type: 'POST',
			url: 'http://codeit.pro/frontTestTask/user/registration',
			data: msg,
			success: function(data) {

				if (data.status == 'Form Error' || data.status == 'Error') {
					addError(8,data.message);
				} else if (data.status == 'OK' ){
					document.location.href = "/index(company).html";
				}

			},
			error:  function(xhr, str){
				addError(7,xhr.responseCode);
			}
		});

	}

});
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
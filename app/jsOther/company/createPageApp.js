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
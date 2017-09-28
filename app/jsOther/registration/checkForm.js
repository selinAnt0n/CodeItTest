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
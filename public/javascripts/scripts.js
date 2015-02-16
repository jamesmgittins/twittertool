function getReplace(action, target) {
	$(target).html("<div class='text-center' style='padding:50px;font-weight:bold;'><span class='glyphicon glyphicon-hourglass'></span></div>");
	$.get(action,function(data){
		$(target).html(data);
	});
}

function postReplace(form, target) {
	$.post($(form).attr('action'), $(form).serialize(),function(data){
		$(target).html(data);
	});
	$(target).html("<div class='text-center' style='padding:50px;font-weight:bold;'><span class='glyphicon glyphicon-hourglass'></span></div>");
}

function tabNavigation(element, event) {
	event.preventDefault();
	$(element).closest('ul').find('li').removeClass('active');	
	$(element).closest('li').addClass('active');
	getReplace($(element).data('action'),$(element).data('target'));
}
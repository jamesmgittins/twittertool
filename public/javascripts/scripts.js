function getReplace(action, target) {
	$.get(action,function(data){
		$(target).html(data);
	});
}

function tabNavigation(element, event) {
	event.preventDefault();
	$(element).closest('ul').find('li').removeClass('active');	
	$(element).closest('li').addClass('active');
	getReplace($(element).data('action'),$(element).data('target'));
}
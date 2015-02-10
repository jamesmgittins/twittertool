function getReplace(action, target) {
	$(target).html("<div class='text-center' style='padding:50px;font-weight:bold;'>Loading data...</div>");
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
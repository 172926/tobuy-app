var ipaddr = 'http://192.168.0.102:8081';


function deletion(id){
				var id = id;
				//console.log($('[id=item-]').length);
				//console.log(id)
				var element = document.getElementById(id);
				element.outerHTML = "";
				delete element;

};

var counter = 0;
$(".btn-add-field").click(function(){
		
			var content = "<div id='item-"+counter+"'><input type='textfield' id='data-"+counter+"' /><a class='ui-btn ui-btn-inline ui-btn-c ui-corner-all ui-icon-delete ui-btn-icon-right ui-mini btn-delete' id='item-"+counter+"' onClick='deletion(this.id)'></a><br></div>"
			$("#form").append(content);
			counter++;

})

$(".btn-sbm").click(function(){
	
	
	alert($('[id^=data-]').length);
	for(var i = 0; i < $('[id^=data-]').length; i++){
	//alert($('#data-' + i).val());
		
		$.ajax({
		url: ipaddr + '/submitList',
		type: 'POST',
		async: false,
		data: {"item_data" : $('#data-' + i).val()},
		success: function(data){},
		error: function(e){alert(e.message)}
	});
	
	}
	
	/*
	$.ajax({
		url: ipaddr + '/submitList',
		type: 'POST',
		async: false,
		data: {"list_id" : $(this).attr("data-list_id")},
		success: function(data){},
		error: function(e){alert(e.message)}
	});
	*/
})
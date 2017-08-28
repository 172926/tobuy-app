var ipaddr = 'http://192.168.0.102:8081';

if(localStorage.list_id){

	$.ajax({
			url: ipaddr + '/editList',
			type: 'POST',
			async: false,
			data: {"list_id" : localStorage.list_id},
			success: function(data){
				localStorage.removeItem('list_id');
				for(var i = 0; i < data.length; i++){
				
					var content = "<div id='item-"+counter+"'><input type='textfield' id='data-"+counter+"' value='"+data[i].item_content+"' /><a class='ui-btn ui-btn-inline ui-btn-c ui-corner-all ui-icon-delete ui-btn-icon-right ui-mini btn-delete' id='item-"+counter+"' onClick='deletion(this.id)'></a><br></div>"
					$("#form").append(content);
					
				}
			},
			error: function(e){alert(e.message)}
		});

}

$.ajax({
	url: ipaddr + '/listgroups',
	type: 'POST',
	data: {"id" : localStorage.id},
	async: true,
	success: function(data){
	
		for (var i = 0; i < data.length / 2; i++) {
		//alert(data[i]);
            var nextId = i;
            nextId++;
			
            var content = "<option id='"+data[i + data.length / 2]+"'>"+data[i]+"</option>";
			$("#group-name").append(content);

		}
	},
	error: function(e){}
});

function deletion(id){
				var id = id;
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
	//alert($('[id^=data-]').length);
	var elem_group = document.getElementById("group-name");
	var group_id = elem_group.options[elem_group.selectedIndex].id;
	//alert(strUser);
	$.ajax({
			url: ipaddr + '/submitList',
			type: 'POST',
			async: false,
			data: {"item_data" : $('#data-' + i).val(), "group_id" : group_id, "list_name" : $("#listname").val()},
			success: function(data){},
			error: function(e){alert(e.message)}
		});
	for(var i = 0; i < $('[id^=data-]').length; i++){	
		$.ajax({
			url: ipaddr + '/submitListItems',
			type: 'POST',
			async: false,
			data: {"item_data" : $('#data-' + i).val(), "group_id" : group_id, "list_name" : $("#listname").val()},
			success: function(data){},
			error: function(e){alert(e.message)}
		});	
	}
	window.location.href="lists.html";
})
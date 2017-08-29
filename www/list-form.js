

var counter = 0;

var ipaddr = 'http://54.226.242.116:8081';


if(localStorage.list_id){

	$.ajax({
			url: ipaddr + '/editList',
			type: 'POST',
			async: false,
			data: {"list_id" : localStorage.list_id},
			success: function(data){
				localStorage.removeItem('list_id');
				document.getElementById("listname").setAttribute("disabled", true);
				document.getElementById("listname").value = data[data.length - 1][0].list_name;
				
				for(var i = 0; i < data.length - 1; i++){
				
					if(data[i].active == 0){
						var content = "<div><input type='textfield' value='"+data[i].item_content+"' disabled />" + 
						"</div>" +
						"<input type='checkbox' checked disabled />"
						$("#form").append(content);
					}else{
						var content2 = "<div id='item-"+counter+"'><input type='textfield' value='"+data[i].item_content+"' disabled />"+
						"</div>" + 
						"<input type='checkbox' id='item-active-"+counter+"' value="+data[i].id+" />"
						$("#form").append(content2);
					}
					//var content = "<div id='item-"+counter+"'><input type='textfield' id='data-"+counter+"' value='"+data[i].item_content+"' disabled />" + 
					//"</div>" + 
					//"<input type='checkbox' id='"+data[i].item_content+"'><br>"
					//"<a class='ui-btn ui-btn-inline ui-btn-c ui-corner-all ui-icon-delete ui-btn-icon-right ui-mini btn-delete' id='item-"+counter+"' onClick='deletion(this.id)'></a><br></div>"
					
					
					//counter++;
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


$(".btn-add-field").click(function(){	
			var content = "<div id='item-"+counter+"'><input type='textfield' id='data-"+counter+"' /><a class='ui-btn ui-btn-inline ui-btn-c ui-corner-all ui-icon-delete ui-btn-icon-right ui-mini btn-delete' id='item-"+counter+"' onClick='deletion(this.id)'></a><br></div>"
			$("#form").append(content);
			counter++;
})

$(".btn-sbm").click(function(){
	//alert($('[id^=data-]').length);
	var elem_group = document.getElementById("group-name");
	var group_id = elem_group.options[elem_group.selectedIndex].id;
	
	
	//alert($('#item-active-1').checked);
	
	$.ajax({
			url: ipaddr + '/submitList',
			type: 'POST',
			async: false,
			data: {"group_id" : group_id, "list_name" : $("#listname").val()},
			success: function(data){},
			error: function(e){alert(e.message)}
		});
	for(var i = 0; i < $('[id^=data-]').length; i++){	
	
	var check = document.getElementById('item-active-' + i);
	if(check == null){
		$.ajax({
			url: ipaddr + '/submitListItems',
			type: 'POST',
			async: false,
			data: {"item_data" : $('#data-' + i).val(), "group_id" : group_id, "list_name" : $("#listname").val()},
			success: function(data){},
			error: function(e){alert(e.message)}
		});	
	}else{
		$.ajax({
			url: ipaddr + '/submitListItems',
			type: 'POST',
			async: false,
			data: {"item_data" : $('#data-' + i).val(), "group_id" : group_id, "list_name" : $("#listname").val(), "item_active" : check.checked},
			success: function(data){},
			error: function(e){alert(e.message)}
		});	
	}
	}
	window.location.href="lists.html";
})
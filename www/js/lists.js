
var ipaddr = 'http://54.226.242.116:8081';


$.ajax({
	url: ipaddr + '/getLists',
	type: 'POST',
	async: true,
	data: {"user_id" : localStorage.id},
	success: function(data){
		for (var i = 0; i < data.length / 3; i++) {
            var nextId = i;
            nextId++;
            var content = "<div data-role='collapsible' data-theme='"+localStorage.theme+"' data-content-theme='"+localStorage.theme+"' id='list" + nextId + "'>" +
                "<h2>" + data[i] + "</h2>" +
                "<h3>Group: "+data[i + (data.length / 3)*2]+"</h3>" +
				"<div id='form'></div>"+
                "<div class='ui-grid-a'>" + "<div class='ui-block-a'>" +
                "<a class='ui-btn ui-btn-inline ui-btn-b ui-corner-all ui-icon-gear ui-btn-icon-left ui-mini btn-edit-list' id=" + data[i] + " data-list_id=" + data[i + (data.length / 3)] + " href='#'>Edit list</a>" + "</div>" +
                "<div class='ui-block-b'>" +
                "<a class='ui-btn ui-btn-inline ui-btn-c ui-corner-all ui-icon-delete ui-btn-icon-right ui-mini btn-delete' id='" + data[i] + "' data-list_id=" + data[i + (data.length / 3)] + " href='#'>Delete list</a>" + "</div>" +
                "</div>" + "</div>";
			$("#setList").append(content).collapsibleset('refresh');
			
			$.ajax({
				url: ipaddr + "/getItems",
				type: 'POST',
				async: true,
				data: {"list_id" : data[i + (data.length / 3)]},
				success: function(data){
					var counter = 0;

					var data_counter = 0;
					for(var i = 0; i < data.length; i++){
				
					if(data[i].active == 0){
						var content = "<div><input type='textfield' value='"+data[i].item_content+"' disabled />" + 
						"</div>" +
						"<input type='checkbox' checked disabled />"
						$("#form").append(content);
					}else{
						var content2 = "<div id='item-"+counter+"'><input type='textfield' id='data-"+data_counter+"' value='"+data[i].item_content+"' disabled />"+
						"</div>" + 
						"<input type='checkbox' id='item-active-"+counter+"' value="+data[i].id+" disabled  />"
						$("#form").append(content2);
						
						counter++;
						data_counter++;
					}
					//var content = "<div id='item-"+counter+"'><input type='textfield' id='data-"+counter+"' value='"+data[i].item_content+"' disabled />" + 
					//"</div>" + 
					//"<input type='checkbox' id='"+data[i].item_content+"'><br>"
					//"<a class='ui-btn ui-btn-inline ui-btn-c ui-corner-all ui-icon-delete ui-btn-icon-right ui-mini btn-delete' id='item-"+counter+"' onClick='deletion(this.id)'></a><br></div>"
					
					
					
					}
				
				},
				error: function(e){}
			})
			
			$('.btn-delete').click(function() {
				$.ajax({
					url: ipaddr + '/deleteList',
					type: 'POST',
					async: false,
					data: {"list_id" : $(this).attr("data-list_id")},
					success: function(data){},
					error: function(e){alert(e.message)}
				});
				location.reload();
			});
			
			$('.btn-edit-list').click(function() {
				
						localStorage.list_id = $(this).attr("data-list_id");
						window.location.href = "list-form.html";
					
				//location.reload();
			});
		}
	},
	error: function(e){}
});

$('.btn-add-list').click(function() {
	window.location.href="list-form.html";
});

//$("#btn-logout").click(function() {

	//localStorage.clear();
	//window.location.href = "index.html";

//})
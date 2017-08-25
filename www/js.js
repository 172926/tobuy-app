var ipaddr = 'http://192.168.0.102:8081';

//Add logined user id to local storage

if(localStorage.email === undefined || localStorage.email == ''){
localStorage.email = prompt("Provide user email:");

$.ajax({
	url: ipaddr + '/getId',
	type: 'POST',
	async: false,
	data: {"email" : localStorage.email},
	success: function(data){
		localStorage.id = data[0];
	},
	error: function(e){//alert(e.message)
	}
});
}

$.ajax({
	url: ipaddr + '/listgroups',
	type: 'POST',
	data: {"id" : localStorage.id},
	async: true,
	success: function(data){
		for (var i = 0; i < data.length / 2; i++) {
            var nextId = i;
            nextId++;
            var content = "<div data-role='collapsible' data-theme='a' data-content-theme='a' id='group" + nextId + "'>" +
                "<h2>" + data[i] + "</h2>" +
                "<ul data-role='listview' data-inset='true' id='appendib"+i+"'>" +
                "<h3>users:</h3>" +
				"<span id='users"+i+"'/>"+
                "</ul>" +
				"<ul data-role='listview' data-inset='true' id='appendib"+i+"'>" +
                "<h3>lists:</h3>" +
				"<span id='lists"+i+"'/>"+
                "</ul>" +
                "<div class='ui-grid-a'>" + "<div class='ui-block-a'>" +
                "<a class='ui-btn ui-btn-inline ui-btn-b ui-corner-all ui-icon-plus ui-btn-icon-left ui-mini btn-add-user' id=" + data[i] + " data-group=" + data[i + (data.length / 2)] + " href='#'>Add User</a>" + "</div>" +
                "<div class='ui-block-b'>" +
                "<a class='ui-btn ui-btn-inline ui-btn-c ui-corner-all ui-icon-delete ui-btn-icon-right ui-mini btn-usr-del' id=" + data[i] + " data-group=" + data[i + (data.length / 2)] + " href='#'>Delete user</a>" + "</div>" +
                "<br />" + "<div class='ui-block-a'>" +
                "<a class='ui-btn ui-btn-inline ui-btn-b ui-corner-all ui-icon-plus ui-btn-icon-left ui-mini btn-add-list' id='" + data[i] + "' data-group=" + data[i + (data.length / 2)] + " href='#'>Create list</a>" + "</div>" +
                "<div class='ui-block-b'>" +
                "<a class='ui-btn ui-btn-inline ui-btn-c ui-corner-all ui-icon-delete ui-btn-icon-right ui-mini btn-delete' id='" + data[i] + "' data-group=" + data[i + (data.length / 2)] + " href='#'>Delete group</a>" + "</div>" +
                "</div>" + "</div>";
			$("#setGroup").append(content).collapsibleset('refresh');
		
			$('.btn-delete').click(function() {
		//alert($(this).attr("data-group"));
			$.ajax({
				url: ipaddr + '/deleteGroup',
				type: 'POST',
				async: false,
				data: {"groupName" : this.id, "id" : localStorage.id, "group_id" : $(this).attr("data-group")},
				success: function(data){

				},
				error: function(e){alert(e.message)}
			});
			location.reload();
		});
		
		}
	},
	error: function(e){alert(e.message)}
});

//Button create group
$('#create-group').click(function() {

	var groupName = prompt("Enter the group name: ");
	
	if(groupName == ""){
		alert("Field cannot be empty!");
	}else{
		$.ajax({
			url: ipaddr + '/createGroup',
			type: 'POST',
			async: false,
			data: {"groupName" : groupName, "id" : localStorage.id},
			success: function(data){},
			error: function(e){alert(e.message)}
		});

		location.reload();
	}
});

//Button logout
$("#btn-logout").click(function() {

	localStorage.clear();
	location.reload();

});
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
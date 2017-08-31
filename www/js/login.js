var ipaddr = 'http://54.226.242.116:8081';
//var ipaddr = 'http://192.168.0.102:8081'
if(localStorage.email){
	window.location.href = "main.html";
}

$('#btn-submit').click(function() {
    $.ajax({
        type: "POST",
        url: ipaddr + '/login',
        data: ({ txt_email: $('#txt-email').val(), txt_password: $('#txt-password').val() }),
        dataType: "json",
        async: false,
        success: function(data) {
            if (data === true) {
				localStorage.email = $('#txt-email').val();
                alert("Succesfully logined");
                window.location.href = "main.html";
                data = false;
            } else {
                alert("Permission denied");
            }
        },
        error: function() {
            alert("Permission denied");
        }
    });
});

$('#btn-register').click(function() {

    $.ajax({
        type: "POST",
        url: ipaddr + '/register',
        data: ({ txt_email: $('#txt-email').val(), txt_password: $('#txt-password').val() }),
        dataType: "json",
        async: true,
        success: function(data) {
        },
		error: function(data){
			//if(data.responseText != ""){
				if(JSON.stringify(data.responseText) != ""){
					alert(JSON.stringify(data.responseText));
				}else{
					alert("Success!");
				}
				location.reload();
		}
    });
	
	function wait(ms){
		var start = new Date().getTime();
		var end = start;
		while(end < start + ms) {
			end = new Date().getTime();
		}
	}
	wait(2000);
	location.reload();
	
});

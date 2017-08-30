var ipaddr = 'http://54.226.242.116:8081';

if(localStorage.email){
	window.location.href = "main.html";
}

$('#btn-submit').click(function() {
alert("started");
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
/*
$('#btn-register').click(function() {

    $.ajax({
        type: "POST",
        url: ipaddr + '/register',
        data: ({ txt_email: $('#txt-email').val(), txt_password: $('#txt-password').val() }),
        dataType: "json",
        async: true,
        success: function(data) {

            }
            /*,
        success: function(data) {
            if (data === true){
				alert("Succesfully logined");
				window.location.href = "groups-body.html";
				data = false;
			}else{
				alert("Permission denied");
			}
        },
		error: function(){
			alert("Permission denied");
		}
    });
});
*/
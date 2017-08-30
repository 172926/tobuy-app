var ipaddr = 'http://192.168.0.101:8081';

$('#btn-submit').click(function() {

    $.ajax({
        type: "POST",
        url: ipaddr + '/login',
        data: ({ txt_email: $('#txt-email').val(), txt_password: $('#txt-password').val() }),
        dataType: "json",
        async: false,
        success: function(data) {
            if (data === true) {
                alert("Succesfully logined");
                window.location.href = "groups-body.html";
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
		} */
    });
});
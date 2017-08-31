
var ipaddr = 'http://54.226.242.116:8081';

$.ajax({
					url: ipaddr + '/sendSms',
					type: 'POST',
					async: false,
					data: {"group_id" : localStorage.group_id},
					success: function(data){
						
						var numberTxt = document.getElementById('numberTxt');
						
						
						for(var i = 0; i < data.length; i++){
						
							numberTxt.value += data[i].phone_number + ",";
						
						}
					
					},
					error: function(){
					//alert(e.message)
					}
				});

var app = {
    sendSms: function() {
        var number = document.getElementById('numberTxt').value;
        var message = document.getElementById('messageTxt').value;
        console.log("number=" + number + ", message= " + message);

        //CONFIGURATION
        var options = {
            replaceLineBreaks: false,
            android: {
                intent: 'INTENT'

            }
        };

        //var success = function () { alert('Message sent successfully'); };
        //var error = function (e) { alert('Message Failed:' + e); };
        sms.send(number, message, options, success, error);
		window.location.href = "main.html";
    }
};
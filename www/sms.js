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

        var success = function () { alert('Message sent successfully'); };
        var error = function (e) { alert('Message Failed:' + e); };
        sms.send(number, message, options, success, error);
    }, 
	checkSMSPermission: function() {
	
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
	
        var success = function (hasPermission) { 
            if (hasPermission) {
                sms.send(number, message, options, success, error);
            }
            else {
            }
        };
        var error = function (e) { alert('Something went wrong:' + e); };
        sms.hasPermission(success, error);
    }
};
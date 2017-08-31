var ipaddr = 'http://54.226.242.116:8081';
//var ipaddr = 'http://192.168.0.102:8081'
//while(localStorage.email === undefined || localStorage.email == '' || localStorage.id === undefined){
//	localStorage.email = prompt("Provide user email:");
//document.getElementById('user-email-main').innerHTML = "User email: " + localStorage.email;

$('#submit-phone-number').click(function() {

    if ($("#phone-number").val() != "") {

        //alert($("#phone-number").val());
        $.ajax({
            url: ipaddr + '/phoneNumber',
            type: 'POST',
            async: false,
            data: { "phone_number": $('#phone-number').val(), "user_id": localStorage.id },
            success: function(data) {
                alert("Successfully updated!");
                location.reload();

            },
            error: function(e) { alert(e) }
        })
    }
});



$.ajax({
    url: ipaddr + '/getId',
    type: 'POST',
    async: false,
    data: { "email": localStorage.email },
    success: function(data) {
        localStorage.id = data[0];
    },
    error: function(e) {
        //alert("User doesn't exist")
    }
});
//}

$.ajax({
    url: ipaddr + '/listgroups',
    type: 'POST',
    data: { "id": localStorage.id },
    async: true,
    success: function(data) {
        for (var i = 0; i < data.length / 2; i++) {
            var nextId = i;
            nextId++;
            var content = "<div data-role='collapsible' data-theme='" + localStorage.theme + "' data-content-theme='" + localStorage.theme + "' id='group" + nextId + "'>" +
                "<h2>" + data[i] + "</h2>" +
                "<ul style='padding-left:0;' data-role='listview' data-inset='true' id='appendib" + i + "'>" +
                "<h3>Users:</h3>" +
                "<span id='users" + i + "'/>" +
                "</ul>" +
                "<ul style='padding-left:0;' data-role='listview' data-inset='true' id='appendib" + i + "'>" +
                "<h3>Lists:</h3>" +
                "<span id='lists" + i + "'/>" +
                "</ul>" +
                "<div class='ui-grid-a'>" +
                "<div class='ui-block-a'>" + "<a class='ui-btn ui-btn-inline ui-btn-b ui-corner-all ui-icon-plus ui-btn-icon-left ui-mini btn-add-user-inv' id='" + data[i] + "' data-group=" + data[i + (data.length / 2)] + " href='#'>Send invite</a>" + "</div>" +
                "<div class='ui-block-a'>" + "<a class='ui-btn ui-btn-inline ui-btn-b ui-corner-all ui-icon-plus ui-btn-icon-left ui-mini btn-add-list' id='" + data[i] + "' data-group=" + data[i + (data.length / 2)] + " href='#'>Create list</a>" + "</div>" +
                "<div class='ui-block-a'>" + "<a class='ui-btn ui-btn-inline ui-btn-b ui-corner-all ui-icon-plus ui-btn-icon-left ui-mini btn-send-sms' id=" + data[i] + " data-group=" + data[i + (data.length / 2)] + " href='#'>Send group SMS</a>" + "</div>" +
                "<br />" +
                "<div class='ui-block-b'>" +
                "<a class='ui-btn ui-btn-inline ui-btn-c ui-corner-all ui-icon-delete ui-btn-icon-right ui-mini btn-delete' id='" + data[i] + "' data-group=" + data[i + (data.length / 2)] + " href='#'>Delete group</a>" + "</div>" +
                "</div>" + "</div>";
            $("#setGroup").append(content).collapsibleset('refresh');
            $('.btn-delete').click(function() {
                $.ajax({
                    url: ipaddr + '/deleteGroup',
                    type: 'POST',
                    async: false,
                    data: { "groupName": this.id, "id": localStorage.id, "group_id": $(this).attr("data-group") },
                    success: function(data) {},
                    error: function(e) { alert(e.message) }
                });

                location.reload();
            });

            var count = 0;
            var datCount = 0;
            var group_id = data[i + (data.length / 2)];

            $.ajax({
                type: "POST",
                url: ipaddr + '/listUsers',
                data: ({ group_id: data[i + (data.length / 2)] }),
                async: true,
                success: function(data) {

                    if (data != "") {
                        var dat = data.length;
                        while (dat > 0) {
                            document.getElementById('users' + count).innerHTML += data[dat - 1].email + "<br>" + data[dat - 1].phone_number;
                            var btn = document.createElement('a');
                            btn.setAttribute("class", "ui-btn ui-btn-inline ui-btn-c ui-corner-all ui-icon-delete ui-btn-icon-notext ui-mini user_id");
                            btn.setAttribute("data-user_id", data[dat - 1].id);
                            btn.setAttribute("data-group_id", group_id);
                            document.getElementById('users' + count).append(btn);
                            document.getElementById('users' + count).innerHTML += "<br>";
                            dat--;
                            datCount++;
                        }
                        count++;
                        datCount = 0;
                    }

                    $('.user_id').click(function() {
                        $.ajax({
                            url: ipaddr + '/deleteUser',
                            type: 'POST',
                            async: false,
                            data: { "user_id": $(this).attr('data-user_id'), "group_id": $(this).attr('data-group_id') },
                            success: function(data) {},
                            error: function(e) { alert(e.message) }
                        });
                        location.reload();
                    });
                }

            });

            var count2 = 0;
            var datCount2 = 0;
            $.ajax({
                type: "POST",
                url: ipaddr + '/listListsGroups',
                data: ({ group_id: data[i + (data.length / 2)] }),
                dataType: "json",
                async: true,
                success: function(data) {
                    if (data != "undefined" && data != "") {
                        var dat = data.length;
                        while (dat > 0) {
                            document.getElementById('lists' + count2).innerHTML += data[dat - 1].list_name + "<br>";
                            dat--;
                            datCount++;
                        }
                        count2++;
                        datCount2 = 0;
                    } else {
                        document.getElementById('lists' + count2).innerHTML = "" + "<br>";
                    }
                }
            });
            /*
            $('.btn-add-user').click(function() {
            	var userEmail = prompt("Enter the user email: ");
            	$.ajax({
            		url: ipaddr + '/addUser',
            		type: 'POST',
            		async: false,
            		data: {"groupName" : this.id, "id" : localStorage.id, "userEmail" : userEmail},
            		success: function(data){},
            		error: function(e){alert(e.message)}
            	});
            	location.reload();
            });
            */


            $('.btn-add-user-inv').click(function() {
                var userEmail = prompt("Enter the user email: ");
                $.ajax({
                    url: ipaddr + '/addUserInv',
                    type: 'POST',
                    async: false,
                    data: { "groupName": this.id, "id": localStorage.id, "userEmail": userEmail, "group_id": $(this).attr('data-group') },
                    success: function(data) {},
                    error: function(e) { alert(e.message) }
                });
                location.reload();
            });





            $('.btn-add-list').click(function() {
                var list_name = prompt("Enter the list name: ");

                if (list_name == "" || list_name == undefined) {
                    alert("Field cannot be empty!");
                } else {
                    $.ajax({
                        url: ipaddr + '/addList',
                        type: 'POST',
                        async: false,
                        data: { "list_name": list_name, "group_id": $(this).attr('data-group') },
                        success: function(data) {},
                        error: function(e) {}
                    });
                    location.reload();
                }

            });



            $('.btn-send-sms').click(function() {
                localStorage.group_id = $(this).attr('data-group');
                window.location.href = "sms.html";

            });
        }
    },
    error: function(e) {}
});

$('#create-group').click(function() {

    var groupName = prompt("Enter the group name: ");

    if (groupName == "" || groupName == undefined) {
        alert("Field cannot be empty!");
    } else {
        $.ajax({
            url: ipaddr + '/createGroup',
            type: 'POST',
            async: false,
            data: { "groupName": groupName, "id": localStorage.id },
            success: function(data) {},
            error: function(e) { alert(e.message) }
        });

        location.reload();
    }
});

$("#btn-logout").click(function() {

    localStorage.clear();
    window.location.href = "index.html";

});
var ipaddr = 'http://54.226.242.116:8081';
//var ipaddr = 'http://192.168.0.102:8081'
var list_count = 0;
$.ajax({
    url: ipaddr + '/getLists',
    type: 'POST',
    async: true,
    data: { "user_id": localStorage.id },
    success: function(data) {
        for (var i = 0; i < data.length / 3; i++) {
            var nextId = i;
            nextId++;
            var content = "<div data-role='collapsible' data-theme='" + localStorage.theme + "' data-content-theme='" + localStorage.theme + "' id='list" + nextId + "'>" +
                "<h2>" + data[i] + "</h2>" +
                "<h3>Group: " + data[i + (data.length / 3) * 2] + "</h3>" +
                "<div id='listform" + list_count + "'><div id='listform2" + list_count + "'></div></div>" +
                "<div class='ui-grid-a'>" + "<div class='ui-block-a'>" +
                "<a class='ui-btn ui-btn-inline ui-btn-b ui-corner-all ui-icon-gear ui-btn-icon-left ui-mini btn-edit-list' id='" + data[i] + "' data-list_id=" + data[i + (data.length / 3)] + " data-group_name='" + data[i + (data.length / 3) * 2] + "' href='#'>Edit list</a>" + "</div>" +
                "<div class='ui-block-b'>" +
                "<a class='ui-btn ui-btn-inline ui-btn-c ui-corner-all ui-icon-delete ui-btn-icon-right ui-mini btn-delete' id='" + data[i] + "' data-list_id=" + data[i + (data.length / 3)] + " href='#'>Delete list</a>" + "</div>" +
                "</div>" + "</div>";
            $("#setList").append(content).collapsibleset('refresh');

            $.ajax({
                url: ipaddr + "/getItems",
                type: 'POST',
                async: false,
                data: { "list_id": data[i + (data.length / 3)] },
                success: function(data) {
                    var counter = 0;
                    var data_counter = 0;

                    for (var i = 0; i < data.length; i++) {

                        if (data[i].active == 0) {
                            var content = "<div class='checkbox'><label style='text-align: left;' class='ui-btn ui-corner-all ui-state-disabled ui-btn-icon-left ui-checkbox-on'>" +
                                "<input disabled='' style='display:none;' type='checkbox' data-enchanced='true'>" + data[i].item_content +
                                "</label></div>"
                            $("#listform" + list_count).append(content);
                        } else {
                            var content2 = "<div class='checkbox' id='item-" + counter + "'>"+
                                "<div style='display: none;'><input type='text' id='data-" + data_counter + "' value='" + data[i].item_content + "' disabled /></div>"+
                                "<label style='text-align: left;' class='ui-btn ui-corner-all ui-btn-icon-left ui-checkbox-off'>" +
                                "<input style='display: none;' type='checkbox' id='item-active-" + counter + "' value=" + data[i].id + " disabled=''  />" + data[i].item_content +  "</label></div>"
                            $("#listform2" + list_count).append(content2);

                            counter++;
                            data_counter++;
                        }

                        //var content = "<div id='item-"+counter+"'><input type='textfield' id='data-"+counter+"' value='"+data[i].item_content+"' disabled />" + 
                        //"</div>" + 
                        //"<input type='checkbox' id='"+data[i].item_content+"'><br>"
                        //"<a class='ui-btn ui-btn-inline ui-btn-c ui-corner-all ui-icon-delete ui-btn-icon-right ui-mini btn-delete' id='item-"+counter+"' onClick='deletion(this.id)'></a><br></div>"



                    }

                },
                error: function(e) {}
            })
            list_count++




            $('.btn-delete').click(function() {
                $.ajax({
                    url: ipaddr + '/deleteList',
                    type: 'POST',
                    async: false,
                    data: { "list_id": $(this).attr("data-list_id") },
                    success: function(data) {},
                    error: function(e) { alert(e.message) }
                });
                location.reload();
            });

            $('.btn-edit-list').click(function() {
                localStorage.group_name = $(this).attr("data-group_name");
                localStorage.list_id = $(this).attr("data-list_id");
                localStorage.editable = true;
                window.location.href = "list-form.html";

                //location.reload();
            });
        }
    },
    error: function(e) {}
});

$('.btn-add-list').click(function() {
    window.location.href = "list-form.html";
});

//$("#btn-logout").click(function() {

//localStorage.clear();
//window.location.href = "index.html";

//})
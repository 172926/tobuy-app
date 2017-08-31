var counter = 0;

var data_counter = 0;

var ipaddr = 'http://54.226.242.116:8081';
//var ipaddr = 'http://192.168.0.102:8081'
if (localStorage.editable) {
    //document.getElementById("group-name").disabled = true;
    localStorage.removeItem('editable');
}
if (localStorage.list_id) {

    $.ajax({
        url: ipaddr + '/editList',
        type: 'POST',
        async: false,
        data: { "list_id": localStorage.list_id },
        success: function(data) {
            localStorage.removeItem('list_id');
            document.getElementById("listname").setAttribute("disabled", true);
            document.getElementById("listname").value = data[data.length - 1][0].list_name;



            for (var i = 0; i < data.length - 1; i++) {

                if (data[i].active == 0) {
                    var content = "<div class='checkbox'><label class='ui-btn ui-btn-icon-left ui-checkbox-on'>" +
                        "<input disabled='' type='checkbox' data-enchanced='true'>" + data[i].item_content +
                        "</label></div>"
                    $("#listform").append(content);
                } else {
                    var content2 = "<div class='checkbox' id='item-" + counter + "'><label class='ui-btn ui-btn-icon-left ui-checkbox-on'>"+
                    "<input type='checkbox' id='item-active-" + counter + "' value='" + data[i].id + "'/>"  + data[i].item_content + 
                        "</label><div  style='display: none;'><input type='text' id='data-" + data_counter + "' value='"+ data[i].item_content +"'></div></div>"
                    $( "#listform2" ).append(content2);

                    counter++;
                    data_counter++;
                }
                //var content = "<div id='item-"+counter+"'><input type='textfield' id='data-"+counter+"' value='"+data[i].item_content+"' disabled />" + 
                //"</div>" + 
                //"<input type='checkbox' id='"+data[i].item_content+"'><br>"
                //"<a class='ui-btn ui-btn-inline ui-btn-c ui-corner-all ui-icon-delete ui-btn-icon-right ui-mini btn-delete' id='item-"+counter+"' onClick='deletion(this.id)'></a><br></div>"



            }
        },
        error: function(e) { alert(e.message) }
    });

}

$.ajax({
    url: ipaddr + '/listgroups',
    type: 'POST',
    data: { "id": localStorage.id },
    async: true,
    success: function(data) {

        for (var i = 0; i < data.length / 2; i++) {
            //alert(data[i]);
            var nextId = i;
            nextId++;

            var content = "<option id='" + data[i + data.length / 2] + "'>" + data[i] + "</option>";
            $("#group-name").append(content);

        }
    },
    error: function(e) {}
});

function deletion(id) {
    var id = id;
    var element = document.getElementById(id);
    //element.style.display = "none";
    element.firstChild.value = "";
    element.style.display = "none";
    //delete element;

};


$(".btn-add-field").click(function() {

    var content = "<div id='item-" + counter + "'><input type='textfield' id='data-" + data_counter + "' /><a class='ui-btn ui-btn-inline ui-btn-c ui-corner-all ui-icon-delete ui-btn-icon-right ui-mini btn-delete' id='item-" + counter + "' onClick='deletion(this.id)'></a><br></div>"
    $("#listform").append(content);
    data_counter++;
    counter++;
})

$(".btn-sbm").click(function() {
    //alert($('[id^=data-]').length);
    var elem_group = document.getElementById("group-name");
    var group_id = elem_group.options[elem_group.selectedIndex].id;


    //alert($('#item-active-1').checked);

    $.ajax({
        url: ipaddr + '/submitList',
        type: 'POST',
        async: false,
        data: { "group_id": group_id, "list_name": $("#listname").val() },
        success: function(data) {},
        error: function(e) { alert(e.message) }
    });
    for (var i = 0; i < $('[id^=data-]').length; i++) {

        var check = document.getElementById('item-active-' + i);

        if (check == null || check.checked == false) {
            if ($('#data-' + i).val() != 0) {
                $.ajax({
                    url: ipaddr + '/submitListItems',
                    type: 'POST',
                    async: false,
                    data: { "item_data": $('#data-' + i).val(), "group_id": group_id, "list_name": $("#listname").val() },
                    success: function(data) {},
                    error: function(e) { alert(e.message) }
                });
            }
        } else {

            $.ajax({
                url: ipaddr + '/submitListItems',
                type: 'POST',
                async: false,
                data: { "item_data": $('#data-' + i).val(), "group_id": group_id, "list_name": $("#listname").val(), "item_id": check.value, "item_active": 0 },
                success: function(data) {},
                error: function(e) { alert(e.message) }
            });

        }
    }
    window.location.href = "lists.html";
});

$("#btn-logout").click(function() {

	localStorage.clear();
	window.location.href = "index.html";

});
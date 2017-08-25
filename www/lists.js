var ipaddr = 'http://192.168.0.102:8081';

$.ajax({
	url: ipaddr + '/getLists',
	type: 'POST',
	async: true,
	data: {"user_id" : localStorage.id},
	success: function(data){
		for (var i = 0; i < data.length / 3; i++) {
            var nextId = i;
            nextId++;
            var content = "<div data-role='collapsible' data-theme='a' data-content-theme='a' id='list" + nextId + "'>" +
                "<h2>" + data[i] + "</h2>" +
                "<h3>Group: "+data[i + (data.length / 3)*2]+"</h3>" +
                "<div class='ui-grid-a'>" + "<div class='ui-block-a'>" +
                "<a class='ui-btn ui-btn-inline ui-btn-b ui-corner-all ui-icon-gear ui-btn-icon-left ui-mini btn-add-user' id=" + data[i] + " data-list_id=" + data[i + (data.length / 3)] + " href='#'>Edit list</a>" + "</div>" +
                "<div class='ui-block-b'>" +
                "<a class='ui-btn ui-btn-inline ui-btn-c ui-corner-all ui-icon-delete ui-btn-icon-right ui-mini btn-delete' id='" + data[i] + "' data-list_id=" + data[i + (data.length / 3)] + " href='#'>Delete list</a>" + "</div>" +
                "</div>" + "</div>";
			$("#setList").append(content).collapsibleset('refresh');
			
			
			$('.btn-delete').click(function() {
				$.ajax({
					url: ipaddr + '/deleteList',
					type: 'POST',
					async: false,
					data: {"list_id" : $(this).attr("data-list_id")},
					success: function(data){},
					error: function(e){alert(e.message)}
				});
				location.reload();
			});
		
		}
	},
	error: function(e){}
});



$("#btn-logout").click(function() {

	localStorage.clear();
	window.location.href = "index.html";

})
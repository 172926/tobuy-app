var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var firebase = require('firebase');
var mysql = require('mysql');
var url = require('url');

/*

												START SERVER

*/
var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Tobuy app listening at http://%s:%s", host, port)

});
app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
/*

												MYSQL CONNECTION

*/
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'tobuy'
});
connection.connect(function(err){
	if(!err){
		console.log("Connected");
	}else{
		console.log("Connection error");
	}
});

/*

												GET USER ID BY EMAIL

*/

app.post('/getId', urlencodedParser, function(req, res){
	var email = JSON.stringify(req.body.email);
	var data = [];
	//console.log(email);
	connection.query("SELECT id FROM users WHERE email=" + email, function(err,rows,fields){
		if(err){
			console.log(err);
		}
		
		values = JSON.parse(JSON.stringify(rows));
		data.push(values[0].id);
		res.send(data);
		res.end();
		
	})
	
	
})

/*

												LIST GROUPS ON MAIN PAGE

*/

app.post('/listgroups', urlencodedParser, function(req, res){
	var groups = [];
	var ids = [];
	var id = req.body.id;
	//console.log(id);
	connection.query("SELECT group_name, group_id FROM group_members WHERE user_id=" + id, function(err, rows, fields){ // cahnge user ID
		
		
		
		values = JSON.parse(JSON.stringify(rows));
		
		//console.log(values); ////////
 		
		for(var i = 0; i < values.length; i++){
			groups.push(values[i].group_name);
			//ids.push(va);
			//groups.push();
		}
		for(var i = 0; i < values.length; i++){
			groups.push(values[i].group_id);
			//ids.push(va);
			//groups.push();
		}
		//console.log(groups);
		res.send(groups);
		res.end();
	})
	
})
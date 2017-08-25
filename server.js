var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var firebase = require('firebase');
var mysql = require('mysql');
var url = require('url');

/*

												FIREBASE INIT

*/

var config = {
    apiKey: "AIzaSyAY1t4H9D3PUeu4j6_odxV1xQ5MAhS_S9Q",
    authDomain: "tobuy-68833.firebaseapp.com",
    databaseURL: "https://tobuy-68833.firebaseio.com",
    projectId: "tobuy-68833",
    storageBucket: "tobuy-68833.appspot.com",
    messagingSenderId: "1092640222732"
};
firebase.initializeApp(config);

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

/*

												CREATE GROUP REQUEST

*/

app.post('/createGroup', urlencodedParser, function(req, res){
	
	var groupName = req.body.groupName;
	var id = req.body.id;
	console.log(groupName);
	connection.query("INSERT INTO groups(group_name, group_owner_id) VALUES('"+groupName+"', "+id+")", function(err,rows,fields){
		
	});
	connection.query("INSERT INTO group_members(group_id, group_name, user_id) VALUES(LAST_INSERT_ID(), '"+groupName+"', "+id+")", function(err,rows,fields){
		
	});
	res.end();
	
});


/*

												DELETE GROUP REQUEST

*/

app.post('/deleteGroup', urlencodedParser, function(req, res) {
var groupName = req.body.groupName;
	var id = req.body.id;
	var group_id = req.body.group_id;
	connection.query("DELETE FROM groups WHERE id="+group_id+" AND group_owner_id="+id+"", function(err,rows,fields){
		
	});
	connection.query("DELETE FROM group_members WHERE group_id="+group_id+" AND user_id="+id+"", function(err,rows,fields){
		
	});
	res.end();
});

/*

												ADD USER TO GROUP REQUEST

*/

app.post('/addUser', urlencodedParser, function(req, res){
	var groupName = req.body.groupName;
	var id = req.body.id;
	var userEmail = req.body.userEmail;
	var group_id;
	//console.log(groupName + id + userEmail);
	
	connection.query("SELECT id FROM groups WHERE group_name='"+groupName+"' AND group_owner_id="+id+"",function(err,rows,fields){
		
		values = JSON.parse(JSON.stringify(rows));
		group_id = values[0].id;
		//console.log("group id = " + group_id);
		
		connection.query("INSERT INTO group_members (group_id, group_name, user_id) VALUES ("+group_id+", '"+groupName+"', (SELECT id FROM users WHERE email='"+userEmail+"'))",function(err,rows,fields){
		//console.log("group issd = " + group_id);
		
		
		})
	})
	
	res.end();
});

/*

												LIST USERS INSIDE GROUP

*/

app.post('/listUsers', urlencodedParser, function(req, res){
	
	var group_id = req.body.group_id;
	//console.log(group_id);
	connection.query("SELECT email, id FROM users WHERE id IN (SELECT user_id FROM group_members WHERE group_id="+group_id+")", function(err, rows, fields){
		
		values = JSON.parse(JSON.stringify(rows));
		//console.log(values);
		res.send(values);
		
//res.end();
	});
	
});

/*

												DELETE USER REQUEST

*/

app.post('/deleteUser', urlencodedParser, function(req, res){
	
	var user_id = req.body.user_id;
	var group_id = req.body.group_id;	
	//console.log(user_id, group_id);
	connection.query("DELETE FROM group_members WHERE user_id="+user_id+" AND group_id="+group_id+"", function(err,rows,fields){
		res.end();
	});
	
});

/*

												CREATE LIST REQUEST

*/

app.post('/addList', urlencodedParser, function(req, res){
	
	var list_name = req.body.list_name;
	var group_id = req.body.group_id;	
	//console.log(list_name, group_id);
	connection.query("INSERT INTO lists(list_name, group_id) VALUES('"+list_name+"', "+group_id+")", function(err,rows,fields){
		
	});
	res.end();
	
});

/*

												LIST LISTS INSIDE GROUP

*/
app.post('/listListsGroups', urlencodedParser, function(req, res){
	
	var group_id = req.body.group_id;	

	connection.query("SELECT list_name FROM lists WHERE group_id="+group_id+"", function(err, rows, fields){
		
		values = JSON.parse(JSON.stringify(rows));
		res.send(values);

	});
	
});

/*

												GET LISTS ON LIST PAGE

*/

app.post('/getLists', urlencodedParser, function(req, res){
	
	var user_id = req.body.user_id;
	var lists = [];
	connection.query("SELECT list_name, lists.id, group_members.group_name FROM lists INNER JOIN group_members ON lists.group_id = group_members.group_id WHERE group_members.user_id="+user_id+"", function(err, rows, fields){
		
		values = JSON.parse(JSON.stringify(rows));
		
		// Get list name
		for(var i = 0; i < values.length; i++){
			lists.push(values[i].list_name);
		}
		// Get list id
		for(var i = 0; i < values.length; i++){
			lists.push(values[i].id);
		}
		// Get group name for which list is related
		for(var i = 0; i < values.length; i++){
			lists.push(values[i].group_name);
		}
		res.send(lists);
		
	});

});

/*

												DELETE LIST REQUEST

*/

app.post('/deleteList', urlencodedParser, function(req, res){

	var list_id = req.body.list_id;
	//console.log(list_id)
	connection.query("DELETE FROM lists WHERE id="+list_id+"", function(err, rows, fields){
		values = JSON.parse(JSON.stringify(rows));
		res.end();
	});
	
});
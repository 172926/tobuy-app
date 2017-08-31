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
	password: 'tobuyapprootpasswd',
	database: 'tobuyapp'
});
connection.connect(function(err){
	if(!err){
		console.log("Connected");
	}else{
		console.log("Connection error");
	}
});


app.post('/login',urlencodedParser, function(req, res) {
	//console.log("login");
	var email = req.body.txt_email;
	var pass = req.body.txt_password;
	const auth = firebase.auth();
	const promise = auth.signInWithEmailAndPassword(email, pass);
	promise.catch(e => res.send(e.message));
	
	firebase.auth().onAuthStateChanged(firebaseUser => {
		if(!firebaseUser){
			//console.log("Denied");
			authenticated = false;
			//res.send(authenticated);
		}
		if(firebaseUser){
			//console.log("Logged");
			authenticated = true;
			res.send(authenticated);
		}
		//console.log(authenticated);
		
	});
	
	var user = firebase.auth().currentUser;
	//console.log(user);
});


app.post('/register', urlencodedParser, function(req, res){

	var email = req.body.txt_email;
	var password = req.body.txt_password;
	//console.log(email + " " + pass);
		var auth = firebase.auth();
		var promise = auth.createUserWithEmailAndPassword(email, password);
		//var err = promise.catch(e => res.status(400).send(e.message));
		var stat = "";
		var err = promise.catch(e => res.status(400).send(e.message));
		connection.query("INSERT INTO users (email) VALUES ('"+email+"')", function(err){
	
		});
		
});


/*

												GET USER ID BY EMAIL

*/

app.post('/getId', urlencodedParser, function(req, res){
	var email = JSON.stringify(req.body.email);
	var data = [];
	
	//if(req.body.email === 'null'){
	//	res.end();
	//}else{
		connection.query("SELECT id FROM users WHERE email=" + email, function(err,rows,fields){
			
			try{	
				values = JSON.parse(JSON.stringify(rows));
				data.push(values[0].id);
				res.send(data);
			}catch(err){
				res.status(400).send(err);
			}
		});
//}
	
	
})

/*

												LIST GROUPS ON MAIN PAGE

*/

app.post('/listgroups', urlencodedParser, function(req, res){
	var groups = [];
	var ids = [];
	var id = req.body.id;

	connection.query("SELECT group_name, group_id FROM group_members WHERE user_id=" + id, function(err, rows, fields){ // cahnge user ID
		
		try{
		values = JSON.parse(JSON.stringify(rows));
 		
		for(var i = 0; i < values.length; i++){
			groups.push(values[i].group_name);
		}
		for(var i = 0; i < values.length; i++){
			groups.push(values[i].group_id);
		}

		res.send(groups);
		
		}catch(err){
			res.status(400).send(err);
		}
	})
	//}
})
app.post('/listgroup', urlencodedParser, function(req, res){
	
	var user_id = req.body.id;
	var group_name = req.body.group_name;
	
	connection.query("SELECT group_id FROM group_members WHERE user_id="+user_id+" AND group_name='"+group_name+"'", function(err, rows, fields){
		try{
			values = JSON.parse(JSON.stringify(rows));
			console.log(values);
			res.send(values);
		}catch(err){
			res.status(400).send(err);
		}
		
		
	})
	
})

/*

												CREATE GROUP REQUEST

*/

app.post('/createGroup', urlencodedParser, function(req, res){
	
	var groupName = req.body.groupName;
	var id = req.body.id;
	//console.log(groupName);
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
	connection.query("DELETE FROM list_items WHERE list_id=(SELECT lists.id FROM lists WHERE lists.group_id="+group_id+")", function(err,rows,fields){
		
	});
	connection.query("DELETE FROM lists WHERE group_id="+group_id+"", function(err,rows,fields){
		
	});
	
	res.end();
});

/*

												ADD USER TO GROUP REQUEST

*/
app.post('/addUserInv', urlencodedParser, function(req, res){
	var groupName = req.body.groupName;
	var id = req.body.id;
	var userEmail = req.body.userEmail;
	var groupId = req.body.group_id;
	var group_id;
	
	//console.log(groupName + " " + id + " " + userEmail);
	connection.query("SELECT id FROM users WHERE email='"+userEmail+"'", function(err, rows, fields){
		values = JSON.parse(JSON.stringify(rows));
		//console.log(values);
		connection.query("INSERT INTO notifications (sender_id, group_id, group_name, receiver_id, accepted) VALUES ("+id+", "+groupId+",'"+groupName+"', "+values[0].id+", 0)", function(err, rows, fields){

		});
		
	});
	res.end();
});

app.post('/getUserInv', urlencodedParser, function(req, res){ ///////////////ADD SENDER EMAIL!!!
	var user_id = req.body.user_id;
	//console.log(user_id)

	connection.query("SELECT group_name, group_id, sender_id, accepted FROM notifications WHERE receiver_id="+user_id+"", function(err, rows, fields){
		try{
			//console.log(rows);
			values = JSON.parse(JSON.stringify(rows));
			res.send(values);
		}catch(err){
			//console.log(err);
			res.status(400).send(err);
		}
	})
})

app.post('/acceptInv', urlencodedParser, function(req, res){
	var user_id = req.body.user_id;
	var group_id = req.body.group_id;
	var group_name = req.body.group_name;
	connection.query("INSERT INTO group_members (group_id, group_name, user_id) VALUES ("+group_id+",'"+group_name+"', "+user_id+")", function(err, rows, fields){
		
	});
	connection.query("DELETE FROM notifications WHERE group_id="+group_id+" AND receiver_id="+user_id+"", function(err, rows, fields){
		
	});
	res.end();
})
app.post('/cancelInv', urlencodedParser, function(req, res){
	var user_id = req.body.user_id;
	var group_id = req.body.group_id;
	var group_name = req.body.group_name;
	connection.query("DELETE FROM notifications WHERE group_id="+group_id+" AND receiver_id="+user_id+"", function(err, rows, fields){
		
	});
	res.end();
})

app.post('/addUser', urlencodedParser, function(req, res){
	var groupName = req.body.groupName;
	var id = req.body.id;
	var userEmail = req.body.userEmail;
	var group_id;
	//console.log(groupName + " " + id + " " + userEmail);
	connection.query("SELECT id FROM groups WHERE group_name='"+groupName+"' AND group_owner_id="+id+"",function(err,rows,fields){
		try{
		
			values = JSON.parse(JSON.stringify(rows));
			group_id = values[0].id;
			
			connection.query("INSERT INTO group_members (group_id, group_name, user_id) VALUES ("+group_id+", '"+groupName+"', (SELECT id FROM users WHERE email='"+userEmail+"'))",function(err,rows,fields){
			});
			res.end();
		}catch(err){
			console.log(err);
			res.status(400).send(err);
		}
		
	})
	
	
});

/*

												LIST USERS INSIDE GROUP

*/

app.post('/listUsers', urlencodedParser, function(req, res){
	
	var group_id = req.body.group_id;
	
	connection.query("SELECT email, id, phone_number FROM users WHERE id IN (SELECT user_id FROM group_members WHERE group_id="+group_id+")", function(err, rows, fields){
		try{
			values = JSON.parse(JSON.stringify(rows));
			//console.log(values);
			res.send(values);
		}catch(err){
			res.status(400).send(err);
		} 
		
		
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
	
	connection.query("INSERT INTO lists(list_name, group_id) VALUES('"+list_name+"', "+group_id+")", function(err,rows,fields){
		
	});
	res.end();
	
});

/*

												LIST LISTS INSIDE GROUP

*/
app.post('/listListsGroups', urlencodedParser, function(req, res){
	
	var group_id = req.body.group_id;	
	//console.log("Get lists");
	connection.query("SELECT list_name FROM lists WHERE group_id="+group_id+"", function(err, rows, fields){
		try{	
			values = JSON.parse(JSON.stringify(rows));
		}catch(err){
			res.status(400).send(err);
		}
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
		try{
			
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
		}catch(err){
			res.status(400).send(err);
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
	});
	connection.query("DELETE FROM list_items WHERE list_id="+list_id+"", function(err, rows, fields){
	})
	res.end();
});

/*

												SUBMIT LIST

*/
app.post('/submitList', urlencodedParser, function(req, res){
	
	var item_data = req.body.item_data;
	var group_id = req.body.group_id;
	var list_name = req.body.list_name
	//var item_active = req.body.item_active;
	connection.query("SELECT list_name FROM lists WHERE list_name='"+list_name+"' AND group_id="+group_id+"", function(err, rows, fields){
		//try{
			values = JSON.parse(JSON.stringify(rows));
			if(values.length == 0){
				connection.query("INSERT INTO lists(list_name, group_id) VALUES('"+list_name+"', "+group_id+")", function(err, rows, fields){
		
				});
			}else{
				connection.query("",function(err, rows,fields){
					
					
					
				})
			}
		//}catch(err){
		//	console.log("No such list error");
		//}
	});
	
	res.end();
});

/*

												SUBMIT LIST ITEMS

*/
app.post('/submitListItems', urlencodedParser, function(req, res){
	
	var item_data = req.body.item_data;
	var group_id = req.body.group_id;
	var list_name = req.body.list_name;
	var item_id = req.body.item_id;
	var item_active = req.body.item_active;
	
	console.log(item_id);
	//console.log(item_id + " " + item_active);
	
	connection.query("SELECT item_content FROM list_items INNER JOIN lists ON list_items.list_id=lists.id WHERE list_items.list_id=(SELECT id FROM lists WHERE list_name='"+list_name+"' AND group_id="+group_id+") AND list_items.item_content='"+item_data+"'", function(err, rows, fields){
		
		try{
			values=JSON.parse(JSON.stringify(rows));
			//console.log(values[1].item_content)
			if(values.length == 0){
				connection.query("INSERT INTO list_items(list_id, item_content, active) VALUES((SELECT id FROM lists WHERE list_name='"+list_name+"' AND group_id="+group_id+"), '"+item_data+"', 1)", function(err, rows, fields){
					//res.end();
				});
			}else{
				
				connection.query("UPDATE list_items SET active=0 WHERE id="+item_id+"",function(err, rows,fields){

				})
				
			}
		}catch(err){console.log(err)}
		
	})
	

	res.end();
});

app.post('/getItems', urlencodedParser, function(req, res){
	
	var list_id = req.body.list_id;
	//console.log(list_id);
		connection.query("SELECT item_content, active FROM list_items WHERE list_id="+list_id+"", function(err, rows, fields){
			try{
				values = JSON.parse(JSON.stringify(rows));
				//console.log("values for " + list_id + ":" + values);
				res.send(values);
			}catch(err){console.log(err)}
			
		});

	
});
/*

												EDIT LIST

*/
app.post('/editList', urlencodedParser, function(req, res){
	
	var list_id = req.body.list_id;

	connection.query("SELECT id, item_content, active FROM list_items WHERE list_id="+list_id+"", function(err, rows, fields){
		
		try{
			values = JSON.parse(JSON.stringify(rows));
			//console.log(values);
		}catch(err){
			res.status(400).send(err);
		}
		connection.query("SELECT list_name FROM lists WHERE id="+list_id+"", function(err, rows, fields){
			values.push(JSON.parse(JSON.stringify(rows)));

			res.send(values);
		});
		
		
	});
	
});

app.post('/phoneNumber', urlencodedParser, function(req, res){
	
	var phone_number = req.body.phone_number;
	var user_id = req.body.user_id;
	
	connection.query("UPDATE users SET phone_number='"+phone_number+"' WHERE id="+user_id+"", function(err, rows, field){
		res.end();
	});
	
});

app.post('/sendSms', urlencodedParser, function(req, res){
	
	var group_id = req.body.group_id;
	
	connection.query("SELECT phone_number FROM users INNER JOIN group_members ON users.id=group_members.user_id WHERE group_members.group_id="+group_id+"", function(err, rows, field){
		try{
			values = JSON.parse(JSON.stringify(rows));
			res.send(values);
		}catch(err){
			res.status(400).send(err);
		}
		
	});
	
});


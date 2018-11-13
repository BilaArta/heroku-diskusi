var express = require('express');
var bodyparser = require('body-parser'); //menyembatani front end dengan back end
var path = require('path');
const beautify = require("mongoose-beautiful-unique-validation");
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
const mongoose = require('mongoose');
const multer = require('multer');

//var db = mongojs('Forum-Diskusi', ['admin']);

var app = express();

// const storage = multer.diskStorage({
// 	destination :function(request, file, cb){
// 		cb(null, 'public/upload/')
// 	},
// 	filename: function(request, file, cb){
// 		cb(null, request.body.nama + ' ' + file.originalname)
// 	}
// })
// const upload = multer({storage : storage})
// app.use(express.static('public'))


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));

// si mamat ------------------------
// mongoose.connect('mongodb://product-oke:basdatf205@ds151024.mlab.com:51024/simamat', { useNewUrlParser: true }, (error) => {

//   if (error) {
// 	console.log('Ada error euy')
// 	return
// }	
// 	console.log('Connect to DB');
//   })  

//mlab bil ----------------
mongoose.connect('mongodb://bil:bilaarta23041998@ds040017.mlab.com:40017/basdat-trial', { useNewUrlParser: true }, (error) => {
  if (error) {
	console.log('Ada error euy')
	return
}	
	console.log('Connect to DB');
  })  


// const users2 = mongoose.Schema({
// 	nama : String,
// 	file: String
// })

// const user2 = mongoose.model('admin', users2);

const msg = mongoose.Schema({
	name : String,
	user : {
		type : String,
		unique : false
	},
	msg_title : {
		type : String
	},
	msg_body : {
		type : String
	},
	status : false,
	date : String
})


const users = mongoose.Schema({
	username : {type : String, 
				require : true, 
				unique:'Two users cannot share the same username ({VALUE})',
				unique: true
	},
	password : String,
	email : 	{type : String, 
				require : true, 
				unique: 'Two users cannot share the same email ({VALUE})',
				unique: true
	},
	date : 		{type : Date, 
				require : true
	},
	img : String
})



// users.plugin(beautify, {
//     defaultMessage: "This custom message will be used as the default"
// })

const message = mongoose.model('message', msg);
const user = mongoose.model('users' , users);

// ---------------------- VALIDATOR ----------------------
// user.on('index', err => {
//     if (err) {
//         console.error('Indexes could not be created:', err);
//         return;
//     }
 
//     // Create two conflicting documents
//     const admin1 = new user({
// 		username: 'admin',
// 		email : "bil@gmail.mocmo",
// 		date : "02/02/1998"
//     });
 
//     admin1.save()
//         .then(() => console.log('Success saving admin1!'))
//         .catch(err => console.error('admin1 could not be saved: '  , err));
 
// });




app.get('/login', function(req, res){
	res.render('login.ejs');
})

app.get('/register', function(req, res){
	res.render('register.ejs');
})

app.get('/', function(req, res){
	res.render('register.ejs');
})
app.get('/profile',  function(req, res){
	res.render('home.ejs');
})

app.get('/home', function(req, res){
	res.render('home2.ejs');
})

app.get('/view', function(req, res){
	res.render('view.ejs');
})

app.get('/profile/login/:username', (req,res) => {
	console.log('-----------');
	message.find((err, message) => {
		//console.log(Alldocs);
		user.findOne({username : req.params.username}, (err, docs) => {
			//console.log(docs)
			
			res.render("home.ejs", {
				title: 'User',
				user : docs,
				message : message
			});
			//res.render('home.ejs')
		})
	})
	
})



// app.post('/upload', upload.any(), function(req, res){
// 	//console.log(request.body);
// 	user2.create({
// 		nama : req.body.nama,
// 		file : req.body.file
// 	})
// 	.then((hasil) => {
// 		console.log(hasil)
// 		res.redirect('/login')	
// 	})
	
// })

// // -------------------------------- LOGIN ----------------------------
// app.post('/loginUser' , (req, res) => {
	
// 	let username = req.body.username;
// 	let pass = req.body.pass;
	
// 	user.findOne({username : username, password: pass}, function (err, user2) {
// 		//
// 		console.log(user2.id);
		
// 		if (!user2) {
// 			return res.status(404).send();
// 		} else {
// 			res.redirect('/profile');
// 		}
//     })
// })




app.post('/regis', (req,res) => {
	//console.log(req.body)
	//harus ada pemeriksaan user yg duplikat
	//console.log('disini');
	console.log({ body: req.body });
	
	//membuat objek user baru
	user.findOne({username: req.body.username}, function(err, docs) {
		if(docs == null){
			user.create({
				username : req.body.username,
				email: req.body.email,
				date : req.body.ttl,
				password : req.body.pass	
			})
			// .then((hasil) => {
			// 	console.log(hasil)
			 	console.log('berhasil');
			 	res.status(200).send('berhasil');
			// })
		} else {
		//	.catch((error) => {
				console.log('hohoho');
				res.status(400).send('gagal');
		//	})
		}
	})
})

app.post('/loginUser', (req, res) => {
	user.findOne({username : req.body.username, password: req.body.pass}, function (err, docs) {
		//console.log(docs)
		if (docs == null){
			console.log('gagal')
			res.status(400).send('username/password salah')
		}else{
			console.log('berhasil')
			res.status(200).send(docs)
		}	
	})
})

app.post('/addMsg', (req, res) => {
	user.findOne({_id : req.body.id}, function (err, docs) {
		// console.log(req.body.type);
		// console.log(req.body.id);
		// console.log(req.body.title);
		// console.log(req.body.body);
		console.log(req.body.date)
		var a;
		if (req.body.type === '1'){
			 a = true;
		} else {
			a = false;
		}
		console.log(a);
		if (docs == null){
			console.log('gagal')
			res.status(400).send('username/password salah')
		}else{
			// for (var index = 0; index < docs.msg.length; index++) {
			// }
			message.create({
				name : req.body.name,
				user : req.body.name + req.body.id,
				msg_title: req.body.title,
				msg_body : req.body.body,
				status : a,
				date : req.body.date
			 })
		}	
	})
})

app.get('*', (req, res) => {
	res.send('Page tidak ketemu')
})

app.listen(process.env.PORT || 3000, function(){
	console.log('Server Started on port 3000......');
})
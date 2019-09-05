var express = require('express');
var router = express.Router();
var userModule = require('../module/users')
var bcruptjs = require('bcryptjs');
var jwt = require('jsonwebtoken');

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

/* Check Emaill Middleware */
function checkEmail (req, res, next){
  var email =  req.body.email;
  var checkExtEmail = userModule.findOne({email: email});
  checkExtEmail.exec((err, data) => {
    if(err) throw new err;
    if(data){
      return res.render('signup', { title: 'password management system', msg: 'Email Already Exist'});
    }
     next();
  })
}

/* Check Emaill Middleware */
function checkUserName (req, res, next){
  var userName =  req.body.name;
  var checkExtUserName = userModule.findOne({userName: userName});
  checkExtUserName.exec((err, data) => {
    if(err) throw new err;
    if(data){
      return res.render('signup', { title: 'password management system', msg: 'Username Already Exist'});
    }
     next();
  })
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'password management system', msg: ''});
}); 

router.post('/', function(req, res, next) {
  var userName =  req.body.name;
  var password =  req.body.pwd;
  var checkUser = userModule.findOne({userName: userName});
  checkUser.exec((err, data) => {
    if(err) throw new err;
    var getUserId  = data._id;
    var token = jwt.sign({ userId: getUserId }, 'loginToken');

    var getPassword = data.password;

    if(bcruptjs.compareSync(password, getPassword)){
      res.render('index', { title: 'password management system', msg: 'User Login Successfully'});
    }else {
      res.render('index', { title: 'password management system', msg: 'Invalid Username or Password'});

    }
   
  })
 
}); 

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'password management system', msg: ''});
});

router.post('/signup', checkUserName, checkEmail, function(req, res, next) {
  var userName =  req.body.name;
  var email =  req.body.email;
  var password =  req.body.pwd;
  var cpassword =  req.body.cpwd;
  if(password !== cpassword){
    res.render('signup', { title: 'password management system', msg: 'Your password is not matched'});
  }else {
    password = bcruptjs.hashSync(password, 10)
    var userDetails = new userModule({
      userName: userName,
      email: email,
      password: password
    });
  
    userDetails.save((err, data) => {
      if (err) throw new err;
      res.render('signup', { title: 'password management system', msg: 'User Registered Successfully'});
    });
  
  }
 
});


router.get('/passwordCategory', function(req, res, next) {
  res.render('password_category', { title: 'password management system'});
});


router.get('/add_new_category', function(req, res, next) {
  res.render('addNewCategory', { title: 'password management system'});
});


router.get('/add_new_password', function(req, res, next) {
  res.render('add_new_password', { title: 'password management system'});
});

router.get('/view-all-password-list', function(req, res, next) {
  res.render('view-all-password-list', { title: 'password management system'});
});
module.exports = router;

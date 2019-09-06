var express = require('express');
var router = express.Router();
var userModule = require('../module/users');
var passwordCategoryModel = require('../module/password_category');
var passwordDetailsModel = require('../module/add_password');
var bcruptjs = require('bcryptjs');
var jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

var getAllPassCat = passwordCategoryModel.find({});
var getAllPassDetails = passwordDetailsModel.find({});



// Login Middleware if save token in localstorage
function checkLoginUser(req, res, next){
  var userToken = localStorage.getItem('userToken');
   try{
      var decoded = jwt.verify(userToken, 'loginToken')
   }catch(err){
     res.redirect('/');
   }
   next();
}
// Create a localStorage
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
  var loginUser = localStorage.getItem('loginUser')
  if(loginUser){
     res.redirect('/dashboard');
  }else{
    res.render('index', { title: 'password management system', msg: ''});
  }
}); 

router.post('/', function(req, res, next) {
  // Collect the form data
  var userName =  req.body.name;
  var password =  req.body.pwd;
  // check data
  var checkUser = userModule.findOne({userName: userName});
  checkUser.exec((err, data) => {
    if(err) throw new err;
    //manage the data from database
    var getUserId  = data._id;
    var getPassword = data.password;
   
    if(bcruptjs.compareSync(password, getPassword)){
      // This create a token
      var token = jwt.sign({ userId: getUserId }, 'loginToken');
      // This locally save a token
      localStorage.setItem('userToken', token);
      localStorage.setItem('loginUser', userName);
      res.redirect('/dashboard');
    }else {
      res.render('index', { title: 'password management system', msg: 'Invalid Username or Password'});
    }
  });
 
}); 

router.get('/dashboard', checkLoginUser, function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser')
  res.render('dashboard', { title: 'password management system', loginUser: loginUser});
});

router.get('/signup', function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser')
  if(loginUser){
     res.redirect('/dashboard');
  }else{
     res.render('signup', { title: 'password management system', msg: ''});
  }
});

router.post('/signup', checkUserName, checkEmail, function(req, res, next) {
  // Collect form data from form
  var userName =  req.body.name;
  var email =  req.body.email;
  var password =  req.body.pwd;
  var cpassword =  req.body.cpwd;
  // If password is not match
  if(password !== cpassword){
    res.render('signup', { title: 'password management system', msg: 'Your password is not matched'});
  }else {
  // If password is match 
    password = bcruptjs.hashSync(password, 10)
    var userDetails = new userModule({
      userName: userName,
      email: email,
      password: password
    });
  // Then save user data in the database
    userDetails.save((err, data) => {
      if (err) throw new err;
      res.render('signup', { title: 'password management system', msg: 'User Registered Successfully'});
    });
  
  }
 
});


router.get('/add_new_category',  checkLoginUser, function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
      res.render('addNewCategory', { title: 'password management system', loginUser: loginUser, errors: '', success: ''});
  });

router.post('/add_new_category',  checkLoginUser, [check('passwordCategory', 'Enter Your Password Category').isLength({min: 1 })], function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser')
  const errors =  validationResult(req);
 if(!errors.isEmpty()){
   res.render('addNewCategory', { title: 'password management system', loginUser: loginUser, errors: errors.mapped(), success: ''});
 }else{
    var passCatName = req.body.passwordCategory;
    var passDetails = new passwordCategoryModel({ pws_category: passCatName});
    passDetails.save((err, data) => {
      if(err) throw new err;
          res.render('addNewCategory', { title: 'password management system', loginUser: loginUser, errors: '', success: 'Password Category Inserted Successfully'});
    });
 }
});

router.get('/passwordCategory', checkLoginUser, function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser')
  getAllPassCat.exec((err, data) => {
    if(err) throw new err;
  res.render('password_category', { title: 'password management system', loginUser: loginUser, records: data});
});
});

// Delete a password category
router.get('/passwordCategory/delete/:id', checkLoginUser, function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  var passCatId = req.params.id;
  var passDelete = passwordCategoryModel.findByIdAndDelete(passCatId);
  passDelete.exec((err) => {
    if(err) throw new err;
 res.redirect('/passwordCategory');
});
});

// Update a password category 
router.get('/passwordCategory/edit/:id', checkLoginUser, function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  var passCatId = req.params.id;
  var getPassCat = passwordCategoryModel.findById(passCatId);
  getPassCat.exec((err, data) => {
    if(err) throw new err;
    res.render('edit_password_category', { title: 'password management system', loginUser: loginUser, errors: '', success: '',  records: data , id: passCatId});
});
});

// Update a password category with post method
router.post('/passwordCategory/edit', checkLoginUser, function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  var passCatId = req.body.id;
  var passCatName = req.body.passwordCategory;
  var updatePassCat = passwordCategoryModel.findByIdAndUpdate(passCatId, {pws_category: passCatName});
  updatePassCat.exec((err, data) => {
    if(err) throw new err;
     res.redirect('/passwordCategory');
  });
});

// Add category Details 
router.get('/add_new_password', checkLoginUser, function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser')
  getAllPassCat.exec((err, data) => {
    if(err) throw new err;
    res.render('add_new_password', { title: 'password management system', loginUser: loginUser, options: data , success: ''});
  })
});

// Add category Details Post Method
router.post('/add_new_password', checkLoginUser, function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  var passwordName =  req.body.pass_name;
  var projectName =  req.body.projectName;
  var passwordDetails =  req.body.pass_details;
  var password_details = new passwordDetailsModel({
    password_category: passwordName,
    project_name: projectName,
    password_details: passwordDetails
  });

  password_details.save((err, data) => {
    if(err) throw new err;
    getAllPassCat.exec((err, opt) => {
      if(err) throw new err;
    res.render('add_new_password', { title: 'password management system', loginUser: loginUser, options: opt, success: 'Data Inserted Successfully'});
  })
})
});

router.get('/view-all-password-list', checkLoginUser, function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  getAllPassDetails.exec((err, data) => {
    if(err) throw new err;
     res.render('view-all-password-list', { title: 'password management system',  loginUser: loginUser, records: data});
  })
});

router.get('/password_details', checkLoginUser, function(req, res, next) {
   res.redirect('/dashboard');
});

router.get('/password_details/edit/:id', checkLoginUser, function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  var passID =  req.params.id;
  var getOnePassDetails = passwordDetailsModel.findById(passID);
  getOnePassDetails.exec((err, data) => {
    if(err) throw new err;
     res.render('edit_pass_details', { title: 'password management system',  loginUser: loginUser, success: '', record: data});
  })
});

router.post('/password_details/edit/:id', checkLoginUser, function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  var passID =  req.params.id;
  var pass_cate = req.body.pass_cate;
  var projectName = req.body.projectName;
  var pass_details = req.body.pass_details;
  var getUpdatedDetails = passwordDetailsModel.findByIdAndUpdate(passID,
    {password_category: pass_cate,
      project_name: projectName,
      password_details: pass_details
     });
    getUpdatedDetails.exec((err, data) => {
    if(err) throw new err;
      res.redirect('/view-all-password-list');
  })
});

router.get('/password_details/delete/:id', checkLoginUser, (req, res) =>{
     var deleteID =  req.params.id;
     passwordDetailsModel.findByIdAndDelete(deleteID).exec((err, data) => {
       if(err) throw new err;
         res.redirect('/view-all-password-list');
     })
});

router.get('/logout', function(req, res, next) {
  localStorage.removeItem('userToken');
  localStorage.removeItem('loginUser');
   res.redirect('/');
});

module.exports = router;

var express = require('express');
var router = express.Router();

const userModel  = require('./users')
const passport = require('passport');
const localStratergy = require("passport-local");  //with the help of this user can login 

passport.use(new localStratergy(userModel.authenticate())); //user can login with this help 

router.get('/', function(req, res) {
  res.render('index');
});

router.get('/profile',isLoggedIn, function(req, res) {   //this is a protected route
  res.render('profile');
});

router.post('/register',function(req,res){
  var userdata =new userModel({
    username:req.body.username,  //taki backend jaa ske
    secret:req.body.secret
  });

  userModel.register(userdata, req.body.password)  //account bna 
   .then(function (registereduser) { 
  passport.authenticate("local")(req,res,function() { //yha se login hua
    res.redirect('/profile');
  })
})



});

router.post("/login",passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/"
}),function(req,res){})


router.get('/logout', function(req, res, next) {
   req.logout(function(err) { 
    if (err) { 
      return next(err);
     } 
     res.redirect('/'); 
    });
   });

   function isLoggedIn(req, res, next) {
     if (req.isAuthenticated()) { 
      return next(); 
    } 
    res.redirect("/"); 
  }




// router.get("/create", async function(req,res){
//   let userdata = await userModel.create({
//         username: "harshi",
//         nickname: "harshiiiiiiiiiii",
//         description: "hello everyone",
//         categories : ['fashion','life','site'],
//        })

//        res.send(userdata);
// })

// router.get('/find', async function(req,res){
 
  //incase sensitive search
//  var regex= new RegExp("^Harsh$",'i')
//  let user= await userModel.find({username:regex})


 //finding category/intrest users
// let user= await userModel.find({categories:{$all:['fashion','site']}})
//  res.send(user);


 //finding users according to their date 
// var date1=new Date('2023-11-27')
// var date2=new Date('2023-11-28');
// let user= await userModel.find({dateCreated:{$gte:date1 ,$lte:date2}})
//  res.send(user);

//finding user having category/field or not 
// let user= await userModel.find({categories:{$exists:true}})
//   res.send(user);

//specefic field length 
// let user= await userModel.find({
//   $expr: {
//     $and : [
//       {$gte: [{$strLenCP: '$nickname'},0]},
//       {$lte: [{$strLenCP: '$nickname'},122]}
//     ]
//   }
// })
//   res.send(user);

// })





// router.get('/failed', function(req, res) {
//   req.flash("age" , 12 ); 
//   res.send("bangaya");
// });

// router.get('/checkkro', function(req, res) {
//   console.log(req.flash("age"));
//   res.send("check at terminal");
// });

module.exports = router;

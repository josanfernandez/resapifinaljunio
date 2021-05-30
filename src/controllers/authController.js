//https://www.freecodecamp.org/news/securing-node-js-restful-apis-with-json-web-tokens-9f811a92bb52/
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

//var VerifyToken = require('./VerifyToken');

router.use(express.urlencoded({ extended: false }));
router.use(express.json());
var User = require('../models/User');

/**
 * Configure JWT
 */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');
var config = require('../config') // get config file

var verifyToken = require('./verifyToken')


router.post('/signup', function(req, res) {
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);


  User.findOne({email:req.body.email}, function (err, data){
    if (data) {
      return res.status(500).send("The user already exists")
    }
    else
    {

      User.create({
        email : req.body.email,
        password : hashedPassword
      },
      function (err, user) {
        if (err) return res.status(500).send("There was a problem registering the user.")
        // create a token
        var token = jwt.sign({ id: user._id }, config.SECRET, {
          expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({ auth: true, token: token });
      }); 
      
    }
  })
  

});

router.get('/me', verifyToken, function(req, res, next) {

  User.findById(req.userId, { password: 0 }, function (err, user) {
    if (err) return res.status(500).send("There was a problem finding the user.");
    if (!user) return res.status(404).send("Usuario no encontrado.");
    
    res.status(200).send(user);
  });
  
});

router.post('/login', function(req, res) {

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send('Usuario no encontrado.');
    
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
    
    var token = jwt.sign({ id: user._id }, config.SECRET, {
      expiresIn: 86400 // expires in 24 hours
    });
    
    res.status(200).send({ auth: true, token: token });
  });
  
});


router.get('/logout', function(req, res) {
  res.status(200).send({ auth: false, token: null });
});




module.exports = router;

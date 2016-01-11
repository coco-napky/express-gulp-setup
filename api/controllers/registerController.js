"use strict";
let express               = require('express'),
    User                  = require('../models/user'),
    passport              = require('passport'),
    LocalStrategy         = require('passport-local').Strategy,
    passportLocalMongoose = require('passport-local-mongoose'),
    router                = express.Router();

router.get('/', (req, res, next) => {
  return res.send('/register');
});

/* POST user . */
router.post('/', (req, res, next) => {
  let params   = {};
      params.name       = req.body.name;
      params.username   = req.body.username;
      params.password   = req.body.password;
      params.admin      = parseInt(req.body.admin);
      params.created_at = new Date();

    User.register(new User(params), params.password , function(err, User) {
      if (err)
        return res.send('Error Registering');

      passport.authenticate('local')(req, res, function () {
          res.redirect('/');
      });
    });
});

module.exports = router;

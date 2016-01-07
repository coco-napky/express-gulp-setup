"use strict";
let express = require('express'),
    router  = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('Users Home');
});

module.exports = router;

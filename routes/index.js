// import express router
const router = require('express').Router();
// import all API routes
const apiRoutes = require('./api');

router.use('/api', apiRoutes);

// a catch-all route in case of wrong URL
router.use((req, res) => {
  res.send("<h1>Wrong Route!</h1>")
});

// export the router
module.exports = router;
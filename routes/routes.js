const express = require('express');
const router = express.Router();

// Example in routes.js or main.js
router.get('/', (req, res) => {
    res.render('index', { title: 'Home Page', users: [] }); // Replace [] with your users array from the database
});


router.get('/add', (req, res) => {
    res.render('add_users', { title: 'Add Users' });
});

module.exports = router;
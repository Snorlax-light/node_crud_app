// Import ng mga modules
const express = require('express');
const router = express.Router();
const User = require('../models/users'); // User model
const multer = require('multer'); // Para sa image upload

// Image upload settings
// (Dito sinasabi kung saan ise-save at anong pangalan ng image file)
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads'); // Sa uploads folder ise-save
    },
    filename: function(req, file, cb) {
        // Pangalan ng file: image-<timestamp>.<ext>
        cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.').pop());
    }
});

// Multer middleware para sa single image upload
var upload = multer({ 
    storage: storage, 
}).single('image'); // Dapat tugma sa name ng input sa form

// Route para ipakita ang edit user form
router.get('/edit/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id); // Hanapin ang user base sa id
        if (!user) {
            return res.redirect('/');
        }
        res.render('edit_user', { title: 'Edit User', user }); // I-render ang edit form
    } catch (err) {
        res.redirect('/');
    }
});

// Route para i-update ang user
router.post('/edit/:id', upload, async (req, res) => {
    try {
        let updateData = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone
        };
        if (req.file) {
            updateData.image = req.file.filename; // Kung may bagong image
        }
        await User.findByIdAndUpdate(req.params.id, updateData); // I-update sa database
        req.session.message = {
            type: 'success',
            message: 'User updated successfully'
        };
        res.redirect('/');
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});

// Route para mag-delete ng user
router.get('/delete/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id); // Burahin sa database
        req.session.message = {
            type: 'success',
            message: 'User deleted successfully'
        };
        res.redirect('/');
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});

// Route para magdagdag ng user sa database
router.post('/add', upload, async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: req.file ? req.file.filename : null // Filename ng image
        });
        await user.save(); // I-save sa database
        req.session.message = {
            type: 'success',
            message: 'User added Successfully'
        };
        res.redirect('/');
    } catch (error) {
        res.json({message: error.message, type: 'danger'});
    }
});



// Route para ipakita ang lahat ng users (Home Page)
router.get('/', async (req, res) => {
    try {
        const users = await User.find(); // Kunin lahat ng users
        const message = req.session.message;
        req.session.message = null; // I-clear ang message pagkatapos ipakita
        res.render('index', { title: 'Home Page', users, message }); // I-render ang index.ejs
    } catch (err) {
        res.render('index', { title: 'Home Page', users: [], message: { type: 'danger', message: 'Error loading users' } });
    }
});


// Route para ipakita ang add user form
router.get('/add', (req, res) => {
    res.render('add_users', { title: 'Add Users' });
});

// Export ng router para magamit sa main.js
module.exports = router;
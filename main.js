// Mga import ng modules
// Pag-import ng mga kinakailangang modules para gumana ang app
require('dotenv').config(); // Para sa environment variables
const express = require('express'); // Main framework ng Node.js
const mongoose = require('mongoose'); // Para sa koneksyon sa MongoDB
const session = require('express-session'); // Para sa session management

const app = express();
const PORT = process.env.PORT || 4000; // Port na gagamitin ng server

// Koneksyon sa database (MongoDB)
// Kumokonekta sa MongoDB gamit ang Mongoose
mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection;
db.on('error', (error)=> console.error(error)); // Error sa koneksyon
db.once('open', () => {
    console.log("Connected to Database"); // Tagumpay na koneksyon
});

// Mga middleware
// Mga middlewares na ginagamit para sa request at response
app.use(express.urlencoded({ extended: false })); // Para mabasa ang form data
app.use(express.json()); // Para mabasa ang JSON data

// Static folder para sa mga na-upload na larawan
// Ginagawang accessible ang uploads folder para sa mga images
app.use('/uploads', express.static('uploads'));

// Session middleware
// Para sa session messages at user sessions
app.use(session(
    {
        secret: 'my secret key', // Palitan ito para sa production
        resave: false,
        saveUninitialized: true,
    }
))

// Flash message middleware
// Para maipasa ang message mula session papunta sa views
app.use(( req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
})

// I-set ang template engine sa EJS
// Para magamit ang EJS bilang view engine
app.set('view engine', 'ejs');

// Routes
// Lahat ng routes ay nasa routes/routes.js
app.use("", require('./routes/routes'));

// Start ng server
// Pinapagana ang server sa napiling port
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

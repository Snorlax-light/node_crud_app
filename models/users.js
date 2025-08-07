// Import ng mongoose para sa database
const mongoose = require('mongoose');

// Gumagawa ng schema para sa User
// (Ang schema ay nagsasabi kung anong fields ang dapat mayroon ang User)
const userSchema = new mongoose.Schema({
    name: {
        type: String, // Pangalan ng user
        required: true, // Kailangan punan
    },
    email: {
        type: String, // Email ng user
        required: true, // Kailangan punan
    },
    phone: {
        type: String, // Telepono ng user
        required: true, // Kailangan punan
    },
    image: {  
        type: String, // Filename ng larawan ng user
        required: true, // Kailangan punan
    },
    created:{
        type: Date, // Kailan ginawa ang user
        default: Date.now,  // Default ay ngayon
        required: true,
    }
});

// Export ng User model para magamit sa ibang files
module.exports = mongoose.model('User', userSchema);
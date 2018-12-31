//Configure the env file 
require('dotenv').config();
//IMPORT
const path = require('path')
const express = require('express')
const logger = require('morgan')
//IMPORT Middlewares 
//Configure body-parser so you can retrieve values from the req.body, if not the req.body will be undefined.
const bodyParser = require('body-parser');
/**
 * Require the session for saving user data and giving a user a unique experience.
 * allows our server to use cookie
 */
const session = require('express-session');
//Use cors for enable cross origin sharign
const cors = require('cors');


//IMPORT Controllers
/**
 * These are how we define our endpoints
 * Set admin functionality 
 * Set cloudinary functionality
 * Set user functionality
 * Set products functionality.
 */
const adminController = require('./controllers/admin_controller');
const cloudinaryController = require('./controllers/cloudinary_controller');
const userController = require('./controllers/user_controller');
const productsController = require('./controllers/products_controller');

//IMPORT mongoose 
/**
 * module to connect to mongodb database instance using it's connection string.
 */
const mongoose = require('mongoose');

//IMPORT express server
/**
 * app is similar to server.js
 * app has a set of features provided by Express framework
 */
const app = express()
//Define the Port
//NOTE: Make sure the Port is the same as the proxy.
const PORT = 3000

//log the request that is processes
app.use(logger('dev'));

//DB
let dev_db_url = 'mongodb://admin:a1b2lol@@ds151082.mlab.com:51082/burreldb';
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


//Serve static files, midlleware pour gérer les fichiers statics(HTML,CSS,JS,Img) dans un sous dossier publiques
app.use(express.static(path.join(__dirname, 'public')));

/*make sure to put the the other MIDLLEWARE here between static et generic*/

//Fire it up
app.listen(PORT);
console.log('Listening on port 3000');
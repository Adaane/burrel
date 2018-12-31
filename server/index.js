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

//MIDDLEWARE
//For initializing the req.body. If the middleware is not used, the req.body is undefined.
app.use(bodyParser.json());
//Serve static files, midlleware pour gérer les fichiers statics(HTML,CSS,JS,Img) dans un sous dossier publiques
app.use(express.static(path.join(__dirname, 'public')));

/*make sure to put the the other MIDLLEWARE here between static et generic*/
app.use(session({
  //a secret for the cookie store it in .env file
  //Secret can be anything.
  secret: process.env.SESSION_SECRET,
  //this for resaving the cookie false, if true can cause a memory leak.
  resave: false,
  //saveUnitialized best false, unless connect to a database.
  saveUninitialized: false,
  cookie: {
    //The max age of the cookie
    maxAge: 1000 * 60 * 60 * 24 * 14
  }
}));
//Allow cross origin requests.
app.use(cors());

setTimeout(() => {
  /**
   * All our endpoint goes here
   * add a set timeout which wraps through all our endpoints
   * Have the time set to 200 milliseconds
   * so our database will connect before accessing any of the endpoints.
   */

   //USER ENDPOINTS
  app.post('/api/login', userController.login)
  //NO NEED FOR A REGISTER SINCE YOUR ARE USING AUTH0.
  //Just need a login, since you are logging from your social media provider no need to register, only looks if a user already has a account.
  //When the user logouts
  app.post('/api/logout', userController.logout);
  app.get('/api/user-data', userController.readUserData);
  //Add a item to cart.
  app.post('/api/user-data/cart', userController.addToCart);
  //Remove a item from the cart.
  // Use request parameter to remove item from cart since you are looking a specific item in cart.
  app.delete('/api/user-data/cart/:id', userController.removeFromCart);
  //When user login

  //PRODUCT ENDPOINTS
  //Getting all the products
  app.get('/api/products', productsController.readAllProducts);
  //Getting a specified product
  //Use a request parameter, since retrieving a specified product..
  app.get('/api/products/:id', productsController.readProduct);

  //ADMIN ENDPOINTS
  //Gets the admin users.
  app.get('/api/users', adminController.getAdminUsers);
  //When a admin creates a product. No need for request parameter in this case. Since we are inserting data to database.
  app.post('/api/products', adminController.createProduct);
  //When a admin update a current product. Need request parameter since updating a specific product based on  the id.
  app.put('/api/products/:id', adminController.updateProduct);
  //When a admin deletes a product, need an id to specify a product to delete.
  app.delete('/api/products/:id', adminController.deleteProduct);


}, 200)

//Fire it up
app.listen(PORT);
console.log('Listening on port 3000');
const mongoose = require('mongoose')

const Schema = mongoose.Schema

//Define your User Collection Objects Structure
//With datatypes
//We'll be using Auth0 for authentication in the future.
//The schema for our model
let UserSchema = new Schema({
//This is where the user will login
//For Now we will be inserting test data
  name: String,
  email: String,
  username: String,
  auth0_id: String
})

// Export the model so it can be used by other files on the project
//that will be inserted to the database.
module.exports = mongoose.model('User', UserSchema);

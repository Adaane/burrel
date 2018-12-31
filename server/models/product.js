const mongoose = require('mongoose')

const Schema = mongoose.Schema

//The schema for our model
let ProductScema = new Schema({
  name: String,
  description: String,
  price: Number
})

// Export the model so it can be used by other files on the project
//that will be inserted to the database.
module.exports = mongoose.model('Product', ProductSchema);
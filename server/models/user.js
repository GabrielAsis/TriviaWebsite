const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  points: {
    type: Number,
    default: 0, // Initialize points to 0 for new users
  },
});

const UserModel = mongoose.model('User', userSchema);
 
module.exports = UserModel;
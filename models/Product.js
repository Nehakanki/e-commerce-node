const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: true, 
    trim: true,  
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  price: {
    type: Number,
    required: true, 
    min: [0.01, 'Price must be at least 0.01']
  },
  stockQuantity: {
    type: Number,
    required: true,
    min: [0, 'Stock quantity cannot be negative']
  },
  category: {
    type: String,
    required: true,
    trim: true  
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, 
{ timestamps: true }); 

module.exports = mongoose.model('Product', ProductSchema);

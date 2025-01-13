const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  discountPercentage: { type: Number },
  rating: {
    rate: { type: Number, default: 0 }, 
    count: { type: Number, default: 0 }
  },
  stock: { type: Number },
  tags: { type: [String] },
  brand: { type: String },
  sku: { type: String },
  weight: { type: Number },
  dimensions: {
    width: { type: Number },
    height: { type: Number },
    depth: { type: Number }
  },
  warrantyInformation: { type: String },
  shippingInformation: { type: String },
  availabilityStatus: { type: String },
  reviews: [{
    rating: { type: Number },
    comment: { type: String },
    date: { type: Date },
    reviewerName: { type: String },
    reviewerEmail: { type: String }
  }],
  returnPolicy: { type: String },
  minimumOrderQuantity: { type: Number },
  meta: {
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    barcode: { type: String },
    qrCode: { type: String }
  },
  images: { type: [String] },
  thumbnail: { type: String }
});

// Create the model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;

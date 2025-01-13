const mongoose = require('mongoose');

const IdCounterSchema = new mongoose.Schema({
  modelName: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 }
});

const IdCounterModel = mongoose.model('IdCounter', IdCounterSchema);

module.exports = IdCounterModel;
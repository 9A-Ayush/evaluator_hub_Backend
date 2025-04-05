const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['metals', 'property', 'vehicles', 'jewelry'],
    required: true
  },
  evaluator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  client: {
    name: {
      type: String,
      required: true
    },
    contact: {
      type: String,
      required: true
    },
    address: String,
    email: String
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  details: {
    location: String,
    specifications: Object,
    condition: String,
    marketValue: Number,
    additionalNotes: String
  },
  totalScore: {
    type: Number,
    default: 0
  },
  reportGenerated: {
    type: Boolean,
    default: false
  },
  criteria: [{
    name: String,
    weight: Number,
    score: Number,
    comments: String
  }]
}, {
  timestamps: true,
  versionKey: false // This removes the __v field
});

const Evaluation = mongoose.model('Evaluation', evaluationSchema);
module.exports = Evaluation; 
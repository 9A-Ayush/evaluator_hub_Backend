const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['evaluation', 'asset', 'combined']
    },
    content: {
        type: String,
        required: true
    },
    evaluation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Evaluation',
        required: true
    },
    findings: {
        type: String,
        required: true
    },
    recommendations: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'pending', 'approved'],
        default: 'draft'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    metadata: {
        lastModified: Date,
        version: Number
    },
    attachments: [{
        filename: String,
        url: String,
        uploadedAt: Date
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Report', reportSchema); 
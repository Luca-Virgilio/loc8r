const mongoose = require('mongoose');

// subdocument must be before the document, in the same File!!!
// subocument of locationSchema
const openingTimeSchema = new mongoose.Schema({
    days: {
        type: String,
        required: true
    },
    opening: String,
    closing: String,
    closed: {
        type: Boolean,
        required: true
    }
});
// subdocument reviewSchema
const reviewSchema = new mongoose.Schema({
    author: {
        type:String,
        required:true
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    reviewText: {
        type: String,
        required: true
    },

    createdOn: {
        type: Date,
        'default': Date.now
    }
});

const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: String,
    rating: {
        type: Number,
        'default': 0,
        min: 0,
        max: 5
    },
    facilities: [String],
    // order: longitude [-180,180], latitude [-90,90]
    coords: {
        type: { type: String },
        coordinates: [Number]
    },
    openingTimes: [openingTimeSchema],
    reviews: [reviewSchema]
});
locationSchema.index({ coords: '2dsphere' });

// compile schema 
mongoose.model('Location', locationSchema);
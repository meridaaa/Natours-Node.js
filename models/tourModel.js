const mongoose = require('mongoose')
const slugify = require('slugify')
// const User = require('./userModel')
const tourSchema= new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        maxlength: [40, 'A tour must have less or equal then 40'],
        minlength: [10, 'A tour must have more or equal then 10']
    },
    slug: String,
    secretTour: {
        type: Boolean,
        default: false
    },
    duration: {
    type: Number,
    required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a maxGroupSize']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, meddium, difficult'
        }
    },
    ratingAverage:{
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1'],
    max: [5, 'Rating must be below 5'],
    set: val => Math.round(val * 10) / 10
    },
    ratingQuantity:{
        type: Number,
        default: 0
    },
    price:{
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: {
        type: Number,
        validate: {
        validator:function(val){
            return val < this.price;
        },
        message: 'Discount pice ({VALUE}) should be below regular price'
    }
    },
    summary:{
        type: String,
        trim: true,
        required: [true, 'A tour must have a summary']
    },
    description:{
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a Cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    startDates: [Date],
    secretTour:{
        type: Boolean,
        default: false
    },
    startLocation: {
        type:{
        type: String,
        default: 'Point',
        enum:['Point']
    },
    coordinates: [Number],
    address: String,
    description: String
    },
    Locations: [{
        type:{
        type: String,
        default: 'Point',
        enum:['Point']
    },
    coordinates: [Number],
    address: String,
    description: String,
    day: Number
    }],
    guid: [
    {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }]
    // reviews:[
    //     {
    //         type: mongoose.Schema.ObjectId,
    //         ref: 'Review'
    //     }
    // ]
},
{
    toJSON: {virtuals : true},
    toObject: {virtuals : true}
}
)

tourSchema.index({price: 1, ratingAverage: -1})
tourSchema.index({slug: 1})
tourSchema.index({ loc: '2dsphere' });
// tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('durationWeeks').get(function(){
    return this.duration / 7;
})

tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
})

tourSchema.pre('save', function(next){
    this.slug = slugify(this.name, {lower: true})
    console.log(this.slug)
    next()
})
// tourSchema.pre('save', async function(next){
//     const guidPromises = this.guid.map(async id => await User.findById(id));
//     this.guid = await Promise.all(guidPromises)
//     next()
// })

tourSchema.pre(/^find/, function(next){
    this.find({secretTour: {$ne: true}})
    this.start = Date.now()
    next()
})
tourSchema.pre(/^find/, function(next){
    this.populate({
        path: 'guid',
        select: '-__v -passwordChangedAt'
    })
    next()
})

// tourSchema.pre('aggregate', function(next){
//     this.pipeline().unshift({ $match: {secretTour: {$ne: true}}})
//     next();
// })
const Tours = mongoose.model('Tour',tourSchema)
module.exports = Tours

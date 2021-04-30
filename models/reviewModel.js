const mongoose = require('mongoose')
const Tour = require('./tourModel')

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review can not be empty!']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    rating: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1'],
        max: [5, 'Rating must be below 5']
    },
},
//     tour: [{
//         type: mongoose.Schema.ObjectId,
//         ref: 'Tour',
//         required: [true, 'Review must belong to a tour.']
//     }],
//     user:[{
//         type: mongoose.Schema.ObjectId,
//         ref: 'User',
//         required: [true, 'Review must belong to a user.']
//     }]
// },
{
    toJSON: {virtuals : true},
    toObject: {virtuals : true}
}
)

reviewSchema.pre(/^find/, async function(next){
    // this.populate({
    //     path : 'tour',
    //     select: 'name'
    // }).populate({
    //     path : 'user',
    //     select: 'name photo'
    // })
    this.populate({
        path : 'user',
        select: 'name photo'
    })
    next()
})

// reviewSchema.index({ tour: 1 , user: 1}, {unique: true}) //combine of tour and review are unique. no duplecates

// reviewSchema.statics.calcAvgRating = async function(tourId){
//     const stats = await this.aggregate([
//         {
//             $match: {tour: tourId}
//         },
//         {
//             $group: {
//                 _id: '$tour',
//                 nRating: {$sum : 1},
//                 avgRating: { $avg: '$rating'}
//             }
//         }
//     ])
    
//     if(stats.length > 0) {
//     await Tour.findByIdAndUpdate(tourId, {
//         ratingQuantity: stats[0].nRating,
//         ratingAverage: stats[0].avgRating
//     })
//     }
//     else{
//         await Tour.findByIdAndUpdate(tourId, {
//         ratingQuantity: 0,
//         ratingAverage: 4.5
//     })
// }
// }

// reviewSchema.post('save', function(){
//     this.constructor.calcAvgRating(this.tour);
// })
// reviewSchema.pre(/^findOneAnd/, async function(next){
//     this.r = await this.findOne()
//     console.log(this.r)
//     next()
// })

// reviewSchema.post(/^findOneAnd/, async function(){
//     await this.r.constructor.calcAvgRating(this.r.tour)
// })

const review = new mongoose.model('Review', reviewSchema)
module.exports = review
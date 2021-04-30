const Tour = require('./../models/tourModel')
const catchAsync = require('./../utlis/catchAsync')
const appError = require('./../utlis/AppError')
const factory = require('./handleFactory')



exports.aliasTopTours = (req, res,next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price'
    req.query.fields = 'name,price,ratingAverage,summary,difficulty';
    next();
}

exports.getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
    {
        $match: { ratingAverage: { $gte: 4.5 } }
    },
    {
        $group: {
        _id: {$toUpper:'$difficulty'},
        numTours: { $sum: 1},
        numRating: { $sum: 'ratingQuantity' },
        avgRating: { $avg: '$ratingAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
        },
    },
    {
    $sort: {avgPrice: 1}
    }
    ]);
    res.status(200).json({
        status: 'success',
        data: {
            stats
        }
    });
});
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match:{ 
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: {$month: '$startDates'},
                numTourStart: { $sum: 1},
                tours: { $push: '$name'}
            }
        },
        {
            $addFields:{ month: '$_id'}
        },
        {
            $project:{ _id: 0}
        },
        {
            $sort: { numTourStart: -1}
        },
        {
            $limit: 12
        }
    ])
    console.log(plan)
        res.status(200).json({
        status: 'success',
        data: {
            plan
        }
    });
})

exports.getToursWithin = catchAsync(async(req, res, next) => {
    const {distance, latlng, unit} = req.params;
    const [lat, lng] = latlng.split(',');

    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1

    if(!lat || !lng){
        return next(new AppError('Please provide latitutr and longitude in the format lat and lng', 400));
    }

    const tours = await Tour.findOne({ 
        startLocation: { $geoWithin: {$centerSphere : [[lng, lat], radius]}}
    })

    console.log(distance, lat, lng, unit)
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data:{
            data: tours
        }
    })
})

exports.getDistances = catchAsync(async(req, res, next) => {
    const {latlng, unit} = req.params;
    const [lat, lng] = latlng.split(',');

    const multiplier = unit === 'mi' ? 0.000621371 : 0.001

    if(!lat || !lng){
        return next(new AppError('Please provide latitutr and longitude in the format lat and lng', 400));
    }

    loc= [lat,lng] 
    // Tour.collection.createIndex( {latlng : "2dsphere" } )
    const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);
  console.log(distances, lat, lng);
    
    res.status(200).json({
    status: 'success',
    data: {
      data: distances
    }
  });
});


exports.getAllTours = factory.getAll(Tour)
exports.getTour =  factory.getOne(Tour, {path: 'reviews'})
exports.createTour = factory.createOne(Tour)
exports.updateTour = factory.updateOne(Tour)
exports.deleteTour = factory.deleteOne(Tour)
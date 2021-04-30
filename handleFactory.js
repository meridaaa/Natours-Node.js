const appError = require('./../utlis/AppError');
const catchAsync = require('./../utlis/catchAsync')
const APIFeatures = require('./../utlis/apiFeatures')

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id)
    if(!doc){
        return next(new appError('No document found with that Id', 404))
    }
    res.status(204).json({
        status: 'success',
        data: null
    })
})

exports.createOne = Model => catchAsync(async (req, res, next) => {
     const newdoc = await Model.create(req.body)
        res.status(201).json({
            status: 'success', 
            data:{
                data: newdoc
            }
        })
})

exports.updateOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    if(!doc){
        return next(new appError('No document found with that Id', 404))
    }
    res.status(200).json({
        status: 'success',
        data: {
            doc
        }
    })
})

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new appError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.getAll = Model =>
catchAsync(async (req, res, next) => {
    let filter = {}
    if(req.params.tourId) filter ={ tour: req.params.tourId}
    const features = new APIFeatures(Model.find(filter), req.query).filter().sort().limitFields().paganinate()
    const doc = await features.query
    res.status(200).json({
        status: 'success',
        reslut: doc.length,
        data: {
            data: doc
        }
    })

})


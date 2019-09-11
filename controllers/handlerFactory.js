const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError("No document found with that id"));
    }

    res.status(204).json({
      status: "Success",
      data: null
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!doc) {
      return next(new AppError("No document found with that id"));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc
      }
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res) => {
    
      const doc = await Model.create(req.body);
      res.status(201).json({
        status: "Success",
        data: {
          data: doc
        }
      });
    
  });


  exports.getOne = (Model, popOptions) => catchAsync (async (req, res,next) => {
      let query = Model.findById(req.params.id);
      if(popOptions) query = Model.findById(req.params.id).populate(popOptions);
    
      const doc = await query;
      if (!doc) {
        return next(new AppError("No document found with that id"));
      }
      res.status(200).json({
        status: "Success",
        data: {
          data: doc
        }
      })
    });

    exports.getAll = Model =>  catchAsync(async (req, res) => {

        //To allow for nested GET reviews on tour (hack)
        let filter = {};
        if(req.params.tourId) filter = {tour:req.params.tourId}
        
          const features = new APIFeatures(Model.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
          const doc = await features.query.explain();
      
          res.status(200).json({
            status: "Success",
            result: doc.length,
            data: {
              data:doc
            }
          });
        
      });
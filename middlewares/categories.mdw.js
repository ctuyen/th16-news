var categoryModel = require('../models/categories.model');

module.exports = (req,res,next)=>{
    categoryModel.allWithDetails().then(data => {
        res.locals.lcCategories = data.rows;
        next();
    })
}
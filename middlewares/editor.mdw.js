var categoryModel = require('../models/categories.model');

module.exports = (req,res,next)=>{
    categoryModel.allWithDetails().then(data => {
        // console.log(data);
        res.locals.lcCategories = data.rows;
        next();
    })
}
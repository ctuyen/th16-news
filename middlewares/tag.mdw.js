var categoryModel = require('../models/tags.model');

module.exports = (req,res,next)=>{
    categoryModel.all().then(data => {
        // console.log(data);
        res.locals.lcTags = data.rows;
        next();
    })
}
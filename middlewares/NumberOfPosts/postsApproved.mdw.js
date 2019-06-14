var postModel = require('../../models/posts.model');

module.exports = (req,res,next)=>{
    postModel.numberByStatusTime('>').then(data => {
        res.locals.lcNumOfApproved = data.rows[0];
        next();
    })
}
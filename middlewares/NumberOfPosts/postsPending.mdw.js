var postModel = require('../../models/posts.model');

module.exports = (req,res,next)=>{
    postModel.numberByStatus('draft').then(data => {
        res.locals.lcNumOfDraft = data.rows[0];
        next();
    })
}
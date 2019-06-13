var postModel = require('../../models/posts.model');

module.exports = (req,res,next)=>{
    postModel.numberByStatus('deny').then(data => {
        res.locals.lcNumOfDeny = data.rows[0];
        next();
    })
}
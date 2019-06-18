var postModel = require('../../models/posts.model');

module.exports = (req,res,next)=>{
    if(req.signedCookies.userId){
        postModel.numberByStatusTime(req.signedCookies.userId,'>').then(data => {
            res.locals.lcNumOfApproved = data.rows[0];
            next();
        })
    }else{
        next();
    }
    
}
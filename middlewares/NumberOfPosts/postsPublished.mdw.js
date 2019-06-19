var postModel = require('../../models/posts.model');

module.exports = (req,res,next)=>{
    if(req.signedCookies.userId){
        postModel.numberByStatusTime(req.signedCookies.userId,'<=').then(data => {
            res.locals.lcNumOfPublished = data.rows[0];
            next();
        })
    }else{
        next();
    }
    
}
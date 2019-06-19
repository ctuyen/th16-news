var postModel = require('../../models/posts.model');

module.exports = (req,res,next)=>{
    if(req.signedCookies.userId){
        postModel.numberByStatus(req.signedCookies.userId,'draft').then(data => {
            res.locals.lcNumOfDraft = data.rows[0];
            next();
        })
    }else{
        next();
    }
    
}
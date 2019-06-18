var postModel = require('../../models/posts.model');

module.exports = (req,res,next)=>{
    if(req.signedCookies.userId){
        postModel.numberByStatus(req.signedCookies.userId,'deny').then(data => {
            res.locals.lcNumOfDeny = data.rows[0];
            next();
        })
    }else{
        next();
    }
    
}
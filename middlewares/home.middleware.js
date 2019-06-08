var categoriesModel = require('../models/categories.model');
var express = require('express');
var router = express.Router();

router.get('/',(req,res)=>{
    var p = categoriesModel.load();
    p.then(data=>{
        var rows = data.rows;
        var
    }).catch(err=>{console.log(err);})
})


module.exports= router;
var express = require("express");

var router = express.Router();

router.post("/", (req, res) => {
  var key = req.body.q;
  if(key){
    console.log("nulll");
  }
  console.log(key);
  console.log("tới search r");
  res.redirect("/posts/1");
});
module.exports = router;

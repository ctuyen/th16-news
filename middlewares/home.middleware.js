var categoriesModel = require("../models/categories.model");

module.exports = (req, res, next) => {
  categoriesModel.all().then(data => {
    var cats = data.rows;

    var listCat = [];
    cats.forEach(cat => {
      if (cat.idcategory == null) {
        var temp = [cat];
        listCat.push(temp);
      }
    });

    cats.forEach(cat => {
      if (cat.idcategory != null) {
        listCat.forEach(list => {
          if (cat.idcategory == list[0].id) {
            list.push(cat);
          }
        });
      }
    });
    for (const list of listCat) {
      if (list.length == 1) list.isSingle = true;
    }
    res.locals.lObjCategories = listCat;
    // console.log(listCat);
    next();
  });
};

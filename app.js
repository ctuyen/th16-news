var express = require("express");
var exphbs = require("express-handlebars");

const app = express();
const port = 8080;

const adminRoute = require('./routes/admin.route')

app.engine("hbs", exphbs());
app.set("view engine", "hbs");
app.set("views", "./views")

app.use(express.static('public'))

app.get("/", function(req, res) {
  res.render("home");
});

app.use('/admin', adminRoute)

app.listen(port, () => console.log("app listening on port " + port));

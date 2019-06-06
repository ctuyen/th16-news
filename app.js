let express = require("express");
let exphbs = require("express-handlebars");
let bodyParser = require('body-parser');
let cookieParser = require("cookie-parser");

const app = express();
const port = 3000;

const adminRoute = require('./routes/admin.route');
const authRoute = require('./routes/auth.route');

const authMiddleware = require('./middlewares/auth.middleware')

app.engine("hbs", exphbs());
app.set("view engine", "hbs");
app.set("views", "./views");

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());

app.get("/", function(req, res) {
  res.render("home");
});

app.use('/admin', authMiddleware.requireAuth, adminRoute);
app.use("/auth", authRoute);

app.listen(port, () => console.log("app listening on port " + port));

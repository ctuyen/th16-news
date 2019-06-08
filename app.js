let express = require("express");
let exphbs = require("express-handlebars");
let bodyParser = require('body-parser');
let cookieParser = require("cookie-parser");

const app = express();
const port = 3000;

const adminRoute = require('./routes/admin/admin.route');
const authRoute = require('./routes/auth.route');

const authMiddleware = require('./middlewares/auth.middleware')

app.use(express.static('public'));

app.engine('hbs',exphbs({
  defaultLayout: 'main.hbs',
  layoutsDir: 'views/_layouts'
}));

app.set("view engine", "hbs");

app.set("views", "./views");


app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());

//MAIN----------------------------------------------------
app.use('/', require('./routes/main/index.route'));

//main-categories
app.use('/categories', require('./routes/main/categories.route'));

//admin---------------------------------------------------
app.use('/admin', authMiddleware.requireAuth, adminRoute);
app.use("/auth", authRoute);
//writer--------------------------------------------------
app.use('/writer', require('./routes/writer/writer.route'));
//editor--------------------------------------------------
app.use('/editor', require('./routes/editor/editor.route'));


//--------------------------------------------------------
//error 
app.use((error, req, res, next) => {
  res.render("error", {
    layout: false,
    message: error.Message,
    error
  });
});
//404
app.use((req, res, next) => {
  res.render("404", { layout: false });
});

//rrrrun
app.listen(port, () => {
  console.log(
    "chạy ngay đi trước khi mọi điều tồi tệ hơn http://localhost:"+port
  );
});
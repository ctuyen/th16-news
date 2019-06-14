require('dotenv').config();

let express = require("express");
let exphbs = require("express-handlebars");
let bodyParser = require("body-parser");
let cookieParser = require("cookie-parser");

const app = express();
const port = 3000;

const adminRoute = require("./routes/admin/admin.route");
const authRoute = require("./routes/auth.route");
const writerRoute = require('./routes/writer/writer.route');
const editerRoute = require('./routes/editor/editor.route');

const authMiddleware = require("./middlewares/auth.middleware");

app.use(express.static("public"));

app.engine(
  "hbs",
  exphbs({
    defaultLayout: "main.hbs",
    layoutsDir: "views/_layouts"
  })
);

app.set("view engine", "hbs");

app.set("views", "./views");


app.use(bodyParser.urlencoded({
  extended: true
})); // for parsing application/x-www-form-urlencoded
app.use(cookieParser(process.env.SESSION_SECRET)); // SESSION_SECRET variable in .env

//load categories mdw-------------------------------------
app.use(require('./middlewares/home.middleware'));
//middleware
app.use(require('./middlewares/categories.mdw'));
app.use(require('./middlewares/tag.mdw'));
//middleware count number of posts
app.use(require('./middlewares/NumberOfPosts/postsPending.mdw'));
app.use(require('./middlewares/NumberOfPosts/postsDenied.mdw'));
app.use(require('./middlewares/NumberOfPosts/postsPublished.mdw'));
app.use(require('./middlewares/NumberOfPosts/postsApproved.mdw'));

//MAIN----------------------------------------------------
app.use('/', require('./routes/main/index.route'));
app.use("/categories", require("./routes/main/category.route"));
app.use("/posts", require("./routes/main/post.route"));
app.use("/admin", authMiddleware.requireAuth, authMiddleware.requireAdmin, adminRoute);
app.use("/auth", authRoute);
app.use('/writer', authMiddleware.requireAuth, authMiddleware.requireWriter, writerRoute);
app.use('/editor', authMiddleware.requireAuth, authMiddleware.requireEditer, editerRoute);


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
  res.render("404", {
    layout: false
  });
});

//rrrrun
app.listen(port, () => {
  console.log(
    "chạy ngay đi trước khi mọi điều tồi tệ hơn - http://localhost:" + port
  );
});
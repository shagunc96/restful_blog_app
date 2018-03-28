var bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    mongoose   = require("mongoose")
    express    =  require("express"),
    app        =  express();

mongoose.connect("mongodb://localhost/restful_blog_app", {
  useMongoClient: true
});

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));

app.use(methodOverride("_method"));

app.use(expressSanitizer());

//Schema
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type:Date, default: Date.now}
});

//Model
var Blog = mongoose.model("Blog", blogSchema);

//Restful Routes

//Root Route
app.get("/", function (req, res) {
  res.redirect("/blogs");
});

//INDEX - Show all Blogs
app.get("/blogs", function (req, res) {
  Blog.find({}, function (err, blogs) {
    if (err) {
      console.log("Error:", err);
    }
    else {
      res.render("index",{blogs: blogs});
    }
  });
});

//NEW
app.get("/blogs/new", function (req, res) {
  res.render("new");
});

//CREATE
app.post("/blogs", function (req, res) {
  //create blog
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, function (err, newBlog) {
    if (err) {
      res.render("new");
    }
    else {
      res.redirect("/blogs");
    };
  });
});

//SHOW
app.get("/blogs/:id", function (req, res) {
  Blog.findById(req.params.id, function (err, foundBlog) {
    if (err) {
      res.redirect("/blogs");
    }
    else {
      res.render("show", {blog:foundBlog})
    }
  });
});

//EDIT
app.get("/blogs/:id/edit", function (req, res) {
  Blog.findById(req.params.id, function (err, foundBlog) {
    if (err) {
      res.redirect("/blogs");
    }
    else {
      res.render("edit", {blog: foundBlog});
    }
  });
});

//UPDATE
app.put("/blogs/:id", function (req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedBlog) {
    if (err) {
      res.redirect("/blogs");
    }
    else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

//DELETE
app.delete("/blogs/:id", function (req, res) {
  //Delete blog
  Blog.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect("/blogs");
    }
    else {
      res.redirect("/blogs");
    }
  });
  //Redirect
});

//Server
app.listen(3000, function () {
  console.log("Server is running!");
});

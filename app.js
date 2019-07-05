var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Blog = require("./models/blog");
var seedDB = require("./seeds");
var Comment = require("./models/comment");
var passport = require("passport");
var LocalStrategy = require("passport-local"); 
var User = require("./models/user");
var methodOverride = require("method-override");
var flash = require("connect-flash");

// Restful api
var commentRoutes = require("./routes/comments");
var blogRoutes = require("./routes/blogs");
var indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost/task_management", {useNewUrlParser:true}, function(err){
　　if(err){
　　　　console.log('Connection Error:' + err)
　　}else{
　　　　console.log('Connection success!')
　　}
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());

// // seed the database
// seedDB();

// Passport config
app.use(require("express-session")({
    secret:"Welcome to CC work",
    resave: false,
    saveUninitialized: false 
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// add curUser
app.use(function(req, res, next) {
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});



app.use("/", indexRoutes);
app.use("/blogs", blogRoutes);
app.use("/blogs/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The server has started!");
});
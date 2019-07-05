var express = require("express");
var router  = express.Router();
var Blog = require("../models/blog");
var middleware = require("../middleware");

// INDEX: Get the data
router.get("/", function(req, res) {
    // Get all blogs from DB
    Blog.find({}, function(err, allBlogs) {
        if(err) {
            console.log(err);
        } else {
            res.render("blogs/index", {blogs:allBlogs});
        }
    });
    
});

// CREATE: Create the new data
router.post("/", middleware.isLoggedIn, function(req, res){
   // get the data from from and add to blogs array, then redirect it
   
   var name = req.body.name;
   var image = req.body.image;
   var desc = req.body.description;
   var author = {
        id: req.user._id,
        username: req.user.username
    }
   var newBlog = {name: name, image: image, description: desc, author:author};
   
   // Create a new blog and save it to the db
   Blog.create(newBlog, function(err, newlyCreated) {
       if(err) {
            console.log(err);
       } else {
           // redirect to blogs
            console.log(newlyCreated);
            res.redirect("/blogs");
       }
   });
});

// NEW: Show the form of the new data to the post
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("blogs/new"); 
});

// SHOW: show more info about one element
router.get("/:id", function(req, res) {
   // find the blog with the id
   Blog.findById(req.params.id).populate("comments").exec(function(err, foundBlog) {
      if(err) {
          console.log(err);
      } else {
          console.log(foundBlog);
          // render the show template for that blog
          res.render("blogs/show", {blog: foundBlog});
      }
   });
});

// Edit the element
router.get("/:id/edit", middleware.checkBlogOwnership,function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        res.render("blogs/edit", {blog: foundBlog}); 
        });
});



// Update the element
router.put("/:id", middleware.checkBlogOwnership, function(req,res) {
   // find and update the posts
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
       if(err) {
           res.redirect("/blogs");
       } else {
           res.redirect("/blogs/"+ req.params.id);
       }
   });
   // redirect to show page
   
});

// Destroy element route
router.delete("/:id", middleware.checkBlogOwnership, function(req,res) {
   Blog.findByIdAndRemove(req.params.id, function(err) {
       if(err) {
           res.redirect("/blogs");
       } else {
           res.redirect("/blogs");
       }
   });
});





module.exports = router;
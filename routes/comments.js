var express = require("express");
var router  = express.Router({mergeParams: true});
var Blog = require("../models/blog");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// =============================================================================
// Comments routes
// =============================================================================
// Comments new
router.get("/new", middleware.isLoggedIn, function(req, res){
    // find blog by id
    console.log(req.params.id);
    Blog.findById(req.params.id, function(err, blog){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {blog: blog});
        }
    })
});

// Create comments
router.post("/", middleware.isLoggedIn, function(req, res) {
   // look up blog using ID
   Blog.findById(req.params.id, function(err, blog) {
      if(err) {
          console.log(err);
          res.redirect("/blogs");
      } else {
           // Create new comment
          Comment.create(req.body.comment, function(err, comment) {
              if(err) {
                  req.flash("error","Something went wrong!");
                  console.log(err);
              } else {
                  // add username and id to comments
                  comment.author.id = req.user._id;
                  comment.author.username = req.user.username;
                  //connect new comment with blog and save it
                  comment.save();
                  blog.comments.push(comment);
                  blog.save();
                  // redirect to the campgroud show page
                  console.log(comment);
                  req.flash("success","Successfully added comments");
                  res.redirect('/blogs/' + blog._id);
              }
          });
      }
   });
});

// comment edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
   Comment.findById(req.params.comment_id, function(err, foundComment) {
      if(err) {
          res.redirect("back");
      } else {
          res.render("comments/edit", {blog_id: req.params.id, comment: foundComment});
      }
   });
});

// comment update route
router.put("/:comment_id",middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if(err) {
            res.redirect("back");
        }  else {
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

// comment destroy route
router.delete("/:comment_id",middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success","Comment Deleted");
            res.redirect("/blogs/"+ req.params.id);
        }
    });
});



module.exports = router;

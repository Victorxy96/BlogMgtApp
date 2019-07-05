var Blog = require("../models/blog");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkBlogOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
            Blog.findById(req.params.id, function(err, foundBlog){
            if(err) {
                req.flash("error","Your request not found");
                res.redirect("back")
            } else {
                // doed he post it
                if(foundBlog.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "Permission Denied");
                    res.redirect("back");
                }
            }
        });
        } else {
            req.flash("error","Please Login")
            res.redirect("back");
        }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
            Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err) {
                res.redirect("back")
            } else {
                // doed he post it
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error","Permission Denied");
                    res.redirect("back");
                }
            }
        });
        } else {
            req.flash("error","Please Login");
            res.redirect("back");
        }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login");
    res.redirect("/login");
}

module.exports = middlewareObj;
var mongoose = require("mongoose");
var Blog = require("./models/blog");
var Comment = require("./models/comment");

var data= [
    {
        name: "Wild",
        image: "https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg",
        description: "This is a test"
    },
    {
        name: "Granite Hill",
        image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg",
        description: "This is awesome!!"
    },
    {
        name: "Candy Hill",
        image: "https://farm4.staticflickr.com/3273/2602356334_20fbb23543.jpg",
        description: "This is great!!"
    }
]

function seedDB() {
    // Remove all data
    Blog.remove({}, function(err) {
        if(err) {
            console.log(err);
        }
        console.log("Database reset!");
        // add test data
        data.forEach(function(seed) {
            Blog.create(seed, function(err, blog) {
                if(err) {
                    console.log(err);
                } else {
                    console.log("add a new data");
                    // add comments
                    Comment.create(
                        {
                            text: "Great experience!",
                            author: "Homer"
                        }, function(err, comment) {
                            if(err) {
                                console.log(err);
                            } else {
                                blog.comments.push(comment);
                                blog.save();
                                console.log("Created new comment");
                            }
                        });
                }
            });
        });
        
    });
    
} 

module.exports = seedDB;


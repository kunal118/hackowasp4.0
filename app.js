const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');

mongoose.connect("mongodb+srv://admin-arsh:arsh123@cluster0.wkoqi.mongodb.net/BlogDB?retryWrites=true&w=majority");

const blogSchema = {
    title: String,
    content: String
}

const Blog = mongoose.model('Blog',blogSchema);

app.get("/",function(req,res){
    res.render("home");
});

app.get("/video",function(req,res){
    res.render("video");
});

app.get("/blog",function(req,res){

    Blog.find(function(err,result)
    {
        if(!err){
            res.render("blog",{blogs:result});
        }
    });
    
});

app.get("/guides",function(req,res){
    res.render("guides");
});

app.post("/blog",function(req,res){
    const titleBlog = req.body.title;
    const newBlog = req.body.newBlog;

    const add =new Blog({
        title: titleBlog,
        content: newBlog
    });
    add.save();
    res.redirect("/blog");
});

app.get("/blog/:customName",function(req,res){
    const blogId = req.params.customName;

    Blog.findOne({_id:blogId},function(err,result){
        if(!err){
            console.log(result.title);
            res.render("post",{oneTitle:result.title,oneContent:result.content});
        }
    });
});


app.listen(3000,function(err)
{
    if(!err){
        console.log("Port 3000 Started");
    }
});



const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
var fs = require('fs');
var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');

const Storage = multer.diskStorage({
    destination:"./public/Uploads/",
    filename:(req,file,cb) => {
        cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
    }
});

var upload = multer({
    storage:Storage
}).single('fileName');

mongoose.connect("mongodb+srv://admin-arsh:arsh123@cluster0.wkoqi.mongodb.net/BlogDB?retryWrites=true&w=majority");

const blogSchema = {
    title: String,
    content: String
}
const Blog = mongoose.model('Blog',blogSchema);

const tuteSchema = {
    title: String,
    name:String
}
const Tute = mongoose.model('Tute',tuteSchema);

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
    Tute.find(function(err,result){
        if(!err){
            res.render("guides",{records:result});
        }
    });
});

app.post("/guides",upload,function(req,res){
    const titleName = req.file.filename;
    const tuteName =  req.body.tuteTitle;
    let success = req.file.filename+" Uploaded successfully";
    const newPdf = new Tute({
        title:titleName,
        name:tuteName
    });
    newPdf.save();
    res.redirect("/guides");
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
            res.render("post",{oneTitle:result.title,oneContent:result.content});
        }
    });
});

app.get("/guide/:name",function(req,res){

    const pdfName = req.params.name;

    

    Tute.findOne({_id:pdfName},function(err,result){
        if(!err){
            console.log(res);
        res.render("guide",{title:result.title});
        }
    });
});

app.listen(3000,function(err)
{
    if(!err){
        console.log("Port 3000 Started");
    }
});



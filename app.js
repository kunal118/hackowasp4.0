require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const encrypt = require("mongoose-encryption");
const { log } = require('console');
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');

let signedIn = false;

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

const userSchema =new mongoose.Schema({
    username:String,
    password:String
});
userSchema.plugin(encrypt,{secret:process.env.PASS,encryptedFields:['password']});

const User = mongoose.model('User',userSchema);



app.get("/",function(req,res){
    res.render("login");
});

app.post("/login",function(req,res){
    const loginUser = req.body.username;
    const pass = req.body.pass;

    User.findOne({username:loginUser},function(err,result){
        if(!err){
            
            if(result.password === pass){
                signedIn = true;
                res.redirect("/home");
            }
        }
    });
});

app.get("/signup",function(req,res){
    res.render("signup");
});

app.post("/signup",function(req,res){
    const user = req.body.username;
    const pass = req.body.pass;

    const newUser = new User({
        username:user,
        password:pass
    });
    newUser.save();
    signedIn = true;
    res.redirect("/home");
});

app.get("/home",function(req,res){
    if(signedIn === true){
        res.render("home");
    }
    else{
        alert("Not Logged In");
    }
});

app.get("/video",function(req,res){
    res.render("video");
});

app.get("/blog",function(req,res){
    if(signedIn == true)
    {Blog.find(function(err,result1)
    {
        if(!err){
            res.render("blog",{blogs:result1});
        }
    });
}
else{
    alert("Not Logged In");
    res.redirect("/")
}
    
});

app.get("/guides",function(req,res){
    if(signedIn===true){
    Tute.find(function(err,result){
        if(!err){
            res.render("guides",{records:result});
        }
    });
    }
    else{
        alert("Not logged in");
        res.redirect("/");
    }
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

    Blog.findOne({_id:blogId},function(err,result3){
        if(!err){
            res.render("post",{oneTitle:result3.title,oneContent:result3.content});
        }
    });
});



app.listen(3000,function(err)
{
    if(!err){
        console.log("Port 3000 Started");
    }
});



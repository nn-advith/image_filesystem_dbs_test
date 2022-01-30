const express = require("express");
const exphbs = require("express-handlebars");
const fileUpload = require("express-fileupload");
const mysql = require('mysql');

const app = express();

//default option

app.use(fileUpload());
app.use(express.static('public'));
app.use(express.static('upload'));

app.set("view engine", 'ejs');



//connection

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'imagetest'
});

conn.connect((err) =>{
    if(err){
        console.log(err);
    }else{
        console.log("Connected");
    }
});

app.get("/", (req, res)=>{
    

    conn.query("SELECT * FROM image", (err, rows)=>{
     
        if(!err){
            res.render("index", {rows: rows});
        }
    });
});

app.post("/", (req, res)=>{

    let sampleFile;
    let uploadPath;
    if(!req.files || Object.keys(req.files).length ===0){
        return res.status(400).send('No files uploaded');
    }

    //name of the input is sample file
    sampleFile = req.files.sampleFile;
    uploadPath = __dirname+'/upload/'+sampleFile.name;
    console.log(sampleFile);

    //use mv() to place file

    sampleFile.mv(uploadPath, function(err){
        if(err){
            return res.status(500).send(err);
        }

        // res.send("File uploaded");
        conn.query("UPDATE image SET photo = ? where id = 1",[sampleFile.name], (err, rows)=>{
     
            if(!err){
                res.redirect("/");
            }
        });
    });



});

app.listen(3000, () => {
    console.log("Server started on port 3000");
})
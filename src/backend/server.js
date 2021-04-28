const path = require("path")
const express = require('express')
const mongodb = require('mongodb').MongoClient;

require('./db/mongoose')
const userRouter = require('./routers/user')

const dbPort = process.env.MONGODB_PORT || 27017;
const dbUrl = "mongodb://127.0.0.1:" + dbPort;

const app = express();
const publicPath = path.join(__dirname,"..","..","public")
app.use(express.static(publicPath));
app.use(express.json());

app.use(userRouter);

app.get("/download", (req,res)=>{
    res.download(path.join(publicPath, "files/Manish_Varma_CV.pdf"));
})

app.get("/thankyou",(req,res)=>{
    res.sendFile(path.join(publicPath, "thankyou.html"));
})

app.post("/feedback", (req,res)=>{
    const feedbackObj = {name: req.body.name, email: req.body.email, message: req.body.message, answered: req.body.answered}
    mongodb.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true},(err, client)=>{
        if(!err){
            const db = client.db("visitors");
            const collection = db.collection("feedback");
            collection.insertOne(feedbackObj).then(()=>{
                res.status(200).send({err: undefined});
                client.close();
            })
        } else {
            res.status(503).send({err: "Information could not be submitted to the database!"});
        }
    })
})

app.get("/console", (req,res)=>{
    res.sendFile(path.join(publicPath, "main.html"));
})

app.get("*", (req, res)=>{
    res.sendFile(path.join(publicPath, "index.html"))
})

module.exports = app;
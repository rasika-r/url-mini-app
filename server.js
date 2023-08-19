const express = require('express')
const mongoose = require('mongoose')
const {createUrl, getUrl,  redirectHandler} = require('./controller/ulController')
const app = express();

app.use(express.static("client/build"))

app.use(express.json())
app.get('/all', getUrl)
app.post('/shorten', createUrl)
app.get("/:id",redirectHandler)


const port = process.env.PORT || 5000;


mongoose.connect("MY-MONGODB-ACCESS-KEY")
.then(()=>{
    console.log("DB Connected...");
    app.listen(port,()=>{
        console.log("Server started... => ",port);
    })
})
.catch(err=>{
    console.log(err);
})
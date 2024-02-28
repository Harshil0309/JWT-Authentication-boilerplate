const express = require("express");
const mongoose = require("mongoose");
const cors=require('cors')
const cookieParser=require('cookie-parser')
mongoose.connect("mongodb://localhost/authentication", {
   useNewUrlParser:true,
   useUnifiedTopology:true 
}, () => {
  console.log("DB connected");
});

app = express();
app.use(cookieParser());
app.use(cors({
    credentials:true,
    //origin is for different framweorks, 3000 react 8080 for vue and 4200 for angular
    origin:['https://localhost:3000','https://localhost:8080','https://localhost:4200']
}));
app.use(express.json())

const routes=require('./routes/routes');
app.use('./api',routes);

app.listen(3000);

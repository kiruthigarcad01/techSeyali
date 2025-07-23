require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const otpRoutes = require('./routes/otpRoutes');
const adminRoutes = require('./routes/adminRoutes');
const managerRoutes = require('./routes/managerRoutes');
app.use(express.json());

app.use("/api/user", userRoutes);  
app.use("/api/otp", otpRoutes); 
app.use("/api/admin",adminRoutes);  
app.use("/api/manager",managerRoutes);

app.use(express.static('public'));


const port = process.env.PORT || 7000;
mongoose.connect("mongodb://localhost:27017/myDemo")
.then( ()=>{
    console.log("DB connected to mongodb://localhost:27017/myDemo")
})
.catch((err)=>{
    console.log("DB connection error:",err)
});


app.listen(port, ()=>{
    console.log(`Server is running at http://localhost:${port}`);
});


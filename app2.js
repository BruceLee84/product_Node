const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');

const  app =express();
app.use(cors());

// app.get('/healthcheck', async(req, res)=>{
//     console.log("it's working")
//     res.send({status:'success'})
// })

mongoose.connect('mongodb://localhost:27017/test',{
     useNewUrlParser:true,
     useUnifiedTopology:true
}).then(data=>{
    console.log("database connected")
}).catch(err=>{
     console.log(err.message)
     process.exit(1)
})



app.get('/', async(req, res)=>{
    console.log('successed')
    res.json({'status':'app2', "message":"successed"})
})

axios.get('http://192.168.29.174:8080/').then(test=>{
    console.log(test.data)
}).catch(error=>{
    console.log(error.message)
})

app.listen(5000, ()=>{
    console.log('server started')
})
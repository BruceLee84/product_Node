const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userroutes =require('./user/user.route')
const watch = require('./products/route');
const cart = require('./products/cart.route');
const order = require('./products/order.route');
const axious = require('axios');
const paypal =require('paypal-rest-sdk');
require('dotenv').config();
//const braintree =require('braintree');
const app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());
 app.use(cors());



// paypal.configure({
//     'mode':'sandbox',
//     'client_id': "AaNg6AKySjSMDbfZU6MyJ9U_wOchdYa5tYeMG6AiscwPpVbBSyG7hBtFWDVU24q7B9BeFBJhrSe8KyqV",
//     'client_secret': "EFfkx-7ZwgsHhzR6IJ-YQiuXuqLf2LihygRJjDvpDgInBH_MQSTLNkMavjwa_LeYP2LQGgBGZ-9gPgZv"
// })



// app.post('/payment', (req, res)=>{
//     try{
//         const create_payment_json = {
//             "intent": "sale",
//             "payer": {
//                 "payment_method" : "paypal"
//             },
//             "redirect_urls": {
//                 "return_url": "http://localhost:3000/success",
//                 "cancel_url": "http://localhost:3000/cancel"
//             },
//             "transactions": [{
//                 "item_list": {
//                     "items": [{
//                         "name": "rolex",
//                         "price": "5.00",
//                         "currency": "USD",
//                         "quantity": 1
//                     }]
//                 },
//                 "amount": {
//                     "currency" : "USD",
//                     "total"    : "5.00"
//                 },
//               }]
//         };
        
//         paypal.payment.create(create_payment_json, function (error, payment) {
//             if (error) {
//                 throw error
//                // return res.json(error.message)
//             } else {
//                 for(let i = 0;i < payment.links.length;i++){
//                   if(payment.links[i].rel === 'approval_url'){
//                     res.redirect(payment.links[i].href);
//                   }
//                 }
//             }
//           });
        

//     }catch(err){
//         console.log(err.message)
//         res.json({'err':err.message})
//     }
// })

// app.get('/success', (req, res) => {
//     const payerId = req.query.PayerID;
//     const paymentId = req.query.paymentId;
   
//     const pay= {
//       "payer_id": payerId,
//       "transactions": [{
//           "amount": {
//               "currency": "USD",
//               "total": "5.00"
//           }
//       }]
//     };
   
//     paypal.payment.execute(paymentId, pay, function (err, payment) {
//       if (err) {
//           console.log(err.response);
//           throw error;
//       } else {
//           console.log(JSON.stringify(payment));
//           res.send('Success');
//       }
//   });
//   });


// app.get('/cancel', (req, res) =>{
//      res.send('Cancelled')});  


// app.get('/', (req, res)=>{
//     res.send(`<h2>Pay<h2>
//     <form action="/payment" method="post">
//     <input type="submit" value="Buy">
//   </form>`)
    
// })


app.get("/healthcheck", async(req,res)=>{
    console.log("It's work");
    res.send({status:'success'})
})
mongoose.connect('mongodb://localhost:27017/Product',{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(data=>{
    console.log("DB connected")
}).catch(error=>{
    console.log(error)
    process.exit(1)
})
  
app.use(express.static("views"));
app.set('view engine', 'ejs');

app.get('/homepage', (req, res)=>{
    res.render("homepage.ejs")
}) 


app.get('/signup', (req, res)=>{
    res.render("signup.ejs")
    
})

app.get('/product', (req,res)=>{
    res.render("products.ejs")
})


app.use('/api/v1/user/',userroutes);
app.use('/api/v2/watch/',watch);
app.use('/api/v3/cart/', cart);
app.use('/api/v4/order', order)


// axious.get('http://192.168.29.174:3000/').then((test)=>{
//     console.log(test.data)
// }).catch((error)=>{
//     console.log(error.message)
// })

app.get('/', async(req, res)=>{
    console.log('it is working')
    res.json({"status":"app1"})
})

app.listen(8080, ()=>{
    console.log("Started...")
})


//http://localhost:8080
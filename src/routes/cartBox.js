const express = require('express');
const { resolve } = require('path');
const cartBox = express.Router();
var bodyParser = require("body-parser");
let cookieParser = require('cookie-parser')
cartBox.use(cookieParser())
let cookieSession = require('cookie-session')
// create application/json parser
var jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: true });

cartBox.post('/addTocart', (req, res) => {
    let PID = req.body.Id
    let PT = req.body.Title
    let model = req.body.Model
    let brand = req.body.Brand
    let price = req.body.Price
    let cartData = [{PID:PID,PT:PT,model:model,brand:brand,price:price}]
    cartData.toString()
    if(req.cookies.toptechMyCart === undefined) {
        let sec = 86400000;
        res.cookie('toptechMyCart', `${cartData}`, {maxAge: sec});
      }
    
     res.render('admin')
})



module.exports = cartBox;
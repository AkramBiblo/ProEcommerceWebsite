const express = require("express");
const report = express.Router();
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const { resolve } = require("path");
const e = require("express");
report.use(cookieParser());
// create application/json parser
var jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: true });

const getDBInfo = require("../../db");
const con = getDBInfo.con;

// stockDetails
report.get("/stock", (req, res) => {
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `SELECT * FROM purchase WHERE status = "stock"`;
  con.query(sql, (err, result_1) => {
    let product = []
    let model = []
    let brand = []
    function pushProduct(p, b) {
      product.push(p)
      brand.push(b)
    }

    for (let i = 0; i < result_1.length; i++) {
      const p = result_1[i];
      let m = p.model;

      if (model.length <= 0) {
        model.push(m)
        let sql_2 = `SELECT * FROM purchase WHERE model = "${m}" AND status = "stock"`;
            con.query(sql_2, (err, result_2) => {
              let modelName = result_2[0].model;
              let stock = result_2.length;
              let brand = result_2[0].brand;
              let stockValue = 0
              for (let pv = 0; pv < result_2.length; pv++) {
                const p = result_2[pv];
                let val = p.pur_rate
                Number(val)
                stockValue+= val
              }
              
              let categoryQuery = `SELECT * FROM basic_products WHERE product_name = "${modelName}" AND brand = "${brand}"`
              con.query(categoryQuery, (err, result_4) => {
                let cateGory = result_4[0].category;
                let productData = [modelName, brand, cateGory, stock, stockValue]
                pushProduct(productData, brand)
              })
            })
      } else {
        let isFound = false;
        for (let j = 0; j < model.length; j++) {
          const elem = model[j];
          if (m == elem) {
            isFound = true;
          }
        }
        if (isFound == false) {
            model.push(m)
            let sql_2 = `SELECT * FROM purchase WHERE model = "${m}" AND status = "stock"`;
            con.query(sql_2, (err, result_2) => {
              let modelName = result_2[0].model;
              let stock = result_2.length;
              let brand = result_2[0].brand;
              let stockValue = 0
              for (let pv_2 = 0; pv_2 < result_2.length; pv_2++) {
                const p = result_2[pv_2];
                let val = p.pur_rate
                Number(val)
                stockValue+= val
              }
              let categoryQuery = `SELECT * FROM basic_products WHERE product_name = "${modelName}" AND brand = "${brand}"`
              con.query(categoryQuery, (err, result_4) => {
                let cateGory = result_4[0].category;
                let productData = [modelName, brand, cateGory, stock, stockValue]
                pushProduct(productData, brand)
              })
            })
         }         
      }
    }

    setTimeout(() => {
      let brandArr = []
      let products = []
      for (let br = 0; br < brand.length; br++) {
        const b = brand[br];
        if (brandArr.length <= 0) {
          brandArr.push(b)
          products.push([])
        } else {
          if (brandArr.includes(b) == false) {
            brandArr.push(b)
            products.push([])
          }
        }
      }
      for (let index = 0; index < product.length; index++) {
        const prod = product[index];
        for (let brarr = 0; brarr < brandArr.length; brarr++) {
          const elem = brandArr[brarr];
          if (prod[1] == elem) {
            products[brarr].push(prod)
          }
        }
      }
      let getBrand = `SELECT * FROM basic_module WHERE module = "brand"`
      con.query(getBrand, (err, result_5) => {
        let Brands = result_5
        let getCategory = `SELECT * FROM basic_module WHERE module = "category"`
        con.query(getCategory, (err, result_6) => {
        let Categories = result_6
        res.render("stockDetails", {title: "Stock", data: products, brand: Brands, category: Categories})
        
      })
      })
    }, 5000)
    
    // res.send(product)
  });
})

report.post("/generate", (req, res) => {
  let brand = req.body.brand;
  let category = req.body.category;
  let model = req.body.model;
  let sql;
  
  if (brand !== "" && category !== "" && model !== "") {
    sql = `SELECT * FROM purchase WHERE model = "${model}" AND brand = "${brand}" AND category = "${category}" AND status = "stock"`;
  } else if (brand == "" && category !== "" && model !== "") {
    sql = `SELECT * FROM purchase WHERE model = "${model}" AND category = "${category}" AND status = "stock"`;
  } else if (brand !== "" && category == "" && model !== "") {
    sql = `SELECT * FROM purchase WHERE model = "${model}" AND brand = "${brand}" AND status = "stock"`;
  } else if (brand !== "" && category !== "" && model == "") {
    sql = `SELECT * FROM purchase WHERE brand = "${brand}" AND category = "${category}" AND status = "stock"`;
  } else if (brand !== "" && category == "" && model == "") {
    sql = `SELECT * FROM purchase WHERE brand = "${brand}" AND status = "stock"`;
  } else if (brand == "" && category !== "" && model == "") {
    sql = `SELECT * FROM purchase WHERE category = "${category}" AND status = "stock"`;
  } else if (brand == "" && category == "" && model !== "") {
    sql = `SELECT * FROM purchase WHERE model = "${model}" AND status = "stock"`;
  }

  con.query(sql, (err, result) => {
    if (result.length <= 0) {
      res.send("Sorry no product available!")
    } else {
      let totalStockValue = 0
      for (let i = 0; i < result.length; i++) {
        const product = result[i];
        let p = product.pur_rate;
        let purchaseRate = Number(p);
        totalStockValue+= purchaseRate
      }
      res.send({result: result, value: totalStockValue})
    }
  })

})

module.exports = report;

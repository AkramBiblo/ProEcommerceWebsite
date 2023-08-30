const express = require("express");
const purchase = express.Router();
const multer = require("multer");
// const upload = multer({ dest: './src/uploadedFiles/' })
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
var bodyParser = require("body-parser");
const e = require("express");
// create application/json parser
var jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: true });

// File upload with multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploadedFiles/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

// purchase.get("/", (req, res) => {
//   const getDBInfo = require("../../db");
//   const con = getDBInfo.con;
//   let sql = `SELECT * FROM basic_module WHERE module = "company"`;
//   con.query(sql, (err, result) => {
//     if (result.length <= 0) {
//       let sql = `SELECT * FROM purchase`;
//       con.query(sql, (err, result) => {
//         res.render("purchase", {
//           message: result,
//           title: "purchases",
//         });
//       });
//     } else {
//       let supplier = result;
//       let sql = `SELECT * FROM purchase`;
//       con.query(sql, (err, result) => {
//         let purchase = result
//         let sql = `SELECT * FROM basic_products`;
//         con.query(sql, (err, result) => {
//           let products = result
//           res.render("purchase", {
//             message: purchase,
//             products: products,
//             supplier: supplier,
//             title: "purchases",
//           });
//         });

//       });
//     }
    
    
//   });

  
// });

purchase.get("/", (req, res) => {
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let data = getdata();

  function getdata() {
    const getDBInfo = require("../../db");
    const con = getDBInfo.con;
    let sql = `SELECT * FROM basic_module WHERE module = "company"`;
    con.query(sql, (err, result) => {
      let companies = [];
      result.forEach((e) => {
        companies.push(e);
      });
      addCompanies(companies);
    });
  }

  function addCompanies(data) {
    const getDBInfo = require("../../db");
    const con = getDBInfo.con;

    let sql = `SELECT * FROM basic_module WHERE module = "godown"`;
    con.query(sql, (err, result) => {
      let godown = [];
      result.forEach((e) => {
        godown.push(e);
      });
      addGodown(godown, data);
    });
  }

  function addGodown(godown, companies) {
    const getDBInfo = require("../../db");
    const con = getDBInfo.con;
    let sql = `SELECT * FROM basic_products`;
    con.query(sql, (err, result) => {
      let products = [];
      result.forEach((e) => {
        products.push(e);
      });
      addProducts(godown, companies, products);
    });
  }

  function addProducts(godown, companies, products) {
    const getDBInfo = require("../../db");
    const con = getDBInfo.con;
    let sql = `SELECT * FROM basic_module WHERE module = "color"`;
    con.query(sql, (err, result) => {
      let color = [];
      result.forEach((e) => {
        color.push(e);
      });
      let data = [godown, companies, products, color];
      res.render("purchase", {
        message: data,
        title: "purchases",
      });
    });
    
  }

});



purchase.post("/new", (req, res) => {
    let date = req.body.pur_date;
    // let challan = req.body.challan;
    let invoice = req.body.invoice;
    let supplier = req.body.supplier;
    let model = req.body.model;
    let godown = req.body.godown;
    let color = req.body.color;
    let prev_stock = req.body.prev_stock;
    let qty = req.body.qty;
    let pur_rate = req.body.pur_rate;
    let disc_per = req.body.disc_per;
    let mrp = req.body.mrp;
    let bc = req.body.b;
    let cal = (Number(mrp) / 100) * Number(disc_per);
    let disc_amt = cal
    
    let s = String(bc)
    let b = s.slice(1, -1)
    let c = b.replace(/['"]+/g, "");
    let d = c.split(',')

    console.log(d.length)

     const getDBInfo = require("../../db");
     const con = getDBInfo.con;
    
     for (let i = 0; i < qty; i++) {
      let sql = `INSERT INTO purchase (challan_no, date, supplier, invoice_no, model, godown, color, prev_stock, qty, pur_rate, disc_per, mrp, disc_amt, cash_sale_rate, barcode)
      VALUES ("${challan}", "${date}", "${supplier}", "${invoice}", "${model}", "${godown}", "${color}", "${challan}", "${prev_stock}", "${pur_rate}", "${disc_per}", "${mrp}", "${disc_amt}", "${mrp}", "${d[i]}")`;
      con.query(sql, (err, result) => {
        console.log('Data entry done')
      })
     }
    
  });



purchase.post("/edit", (req, res) => {
  let cid = req.body.cid;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `SELECT * FROM purchase WHERE id = "${cid}"`;
  con.query(sql, (err, result) => {
    let html = `<form action="/purchase/edit_update" method="POST">
              <div class="container mt-2">
                  <div class="row mt-2">
                      <div class="col">
                          <div class="row mt-3">
                              <div class="col-lg-4">
                                  <h6><label for="name">Name</label></h6>
                              </div>
                              <div class="col-lg-8">
                                  <input type="text" class="form-control" name="name" value="${result[0].name}">
                              </div>
                          </div>
                          <div class="row mt-3">
                              <div class="col-lg-4">
                                  <h6><label for="contact">Contact No</label></h6>
                              </div>
                              <div class="col-lg-8">
                                  <input type="number" class="form-control" name="contact" value="${result[0].contact}">
                              </div>
                          </div>
                          <div class="row mt-3">
                              <div class="col-lg-4">
                                  <h6><label for="p_address">Address</label></h6>
                              </div>
                              <div class="col-lg-8">
                                  <input type="text" class="form-control" name="p_address" value="${result[0].address}">
                              </div>
                          </div>
                          <div class="row mt-3">
                              <div class="col-lg-4">
                                  <h6><label for="email">Email</label></h6>
                              </div>
                              <div class="col-lg-8">
                                  <input type="text" class="form-control" name="email" value="${result[0].email}">
                              </div>
                          </div>
                          <div class="row mt-3">
                              <div class="col-lg-4">
                                  <h6><label for="NID">NID</label></h6>
                              </div>
                              <div class="col-lg-8">
                                  <input type="text" class="form-control" name="NID" value="${result[0].nid}">
                              </div>
                          </div>
                        </div>

                        <div class="col">
                        
                          <div class="row mt-3">
                              <div class="col-lg-4">
                                  <h6><label for="g_name">Guarantor Name</label></h6>
                              </div>
                              <div class="col-lg-8">
                                  <input type="text" class="form-control" name="g_name" value="${result[0].g_name}">
                              </div>
                          </div>
                          <div class="row mt-3">
                              <div class="col-lg-4">
                                  <h6><label for="g_address">Guarantors Address</label></h6>
                              </div>
                              <div class="col-lg-8">
                                  <input type="text" class="form-control" name="g_address" value="${result[0].g_address}">
                              </div>
                          </div>
                          <div class="row mt-3">
                              <div class="col-lg-4">
                                  <h6><label for="G_NID">Guarantor NID</label></h6>
                              </div>
                              <div class="col-lg-8">
                                  <input type="text" class="form-control" name="G_NID" value="${result[0].g_nid}">
                              </div>
                          </div>
                          <div class="row mt-3">
                              <div class="col-lg-4">
                                  <h6><label for="g_contact">Guarantors Contact</label></h6>
                              </div>
                              <div class="col-lg-8">
                                  <input type="number" class="form-control" name="g_contact" value="${result[0].g_contact}">
                              </div>
                          </div>
                      </div>
                  </div>
                  <div class="row d-flex justify-content-end mt-4 mr-3">
                    <input value="${result[0].id}" name="cid" type="hidden">
                    <input class="btn btn-success mr-2" name="submit" type="submit" value="Update">
                </div>
              </div>
             </form>`;
    res.send(html);
  });
});

purchase.post("/edit_update", (req, res) => {
  let cid = req.body.cid;
  let name = req.body.name;
  let p_address = req.body.p_address;
  let contact = req.body.contact;
  let NID = req.body.NID;
  let email = req.body.email;
  let g_name = req.body.g_name;
  let g_address = req.body.g_address;
  let G_NID = req.body.G_NID;
  let g_contact = req.body.g_contact;

  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `UPDATE purchase SET name = "${name}", address = "${p_address}", contact = "${contact}", nid = "${NID}", email = "${email}", g_name = "${g_name}", g_address = "${g_address}", g_nid = "${G_NID}", g_contact = "${g_contact}" WHERE id = "${cid}"`;
  con.query(sql, (err, result) => {
    let sql = `SELECT * FROM purchase`;
    con.query(sql, (err, result) => {
      res.render("purchase", {
        successMsg: "purchase updated successfully!",
        message: result,
        title: "purchase",
      });
    });
  });
});

purchase.post("/purchase_delete", (req, res) => {
  let cid = req.body.cid;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  
  let sql = `DELETE FROM purchase WHERE id = "${cid}"`;
  con.query(sql, (err, result) => {
    
    let sql = `SELECT * FROM purchase`;
    con.query(sql, (err, result) => {
      res.render("purchase", {
        successMsg: "purchase removed successfully!",
        message: result,
        title: "purchase",
      });
    });
  });
});

purchase.post("/purchase_search", (req, res) => {
  let SI = req.body.SI;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `SELECT * FROM purchase WHERE name LIKE "%${SI}%" OR contact LIKE "%${SI}%"`;
  con.query(sql, (err, result) => {
    if (result.length <= 0) {
      res.send("No purchase found!");
    } else {
      res.send(result);
    }
  });
});

module.exports = purchase;

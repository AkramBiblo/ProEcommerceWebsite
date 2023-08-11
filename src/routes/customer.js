const express = require("express");
const customer = express.Router();
const multer = require("multer");
// const upload = multer({ dest: './src/uploadedFiles/' })
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
var bodyParser = require("body-parser");
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

customer.get("/", (req, res) => {
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `SELECT * FROM customer`;
  con.query(sql, (err, result) => {
    res.render("customer", {
      message: result,
      title: "Customers",
    });
  });
});

customer.post(
  "/new", (req, res) => {
    let name = req.body.name;
    let p_address = req.body.p_address;
    let c_type = req.body.c_type;
    let contact = req.body.contact;
    let NID = req.body.NID;
    let email = req.body.email;
    let g_name = req.body.g_name;
    let g_address = req.body.g_address;
    let G_NID = req.body.G_NID;
    let g_contact = req.body.g_contact;
    let balance = req.body.O_B;
    
     const getDBInfo = require("../../db");
     const con = getDBInfo.con;

    let sql_query = `SELECT * FROM customer WHERE name = "${name}" OR contact = "${contact}"`;
    con.query(sql_query, (err, result) => {
      if (result.length <= 0) {
        let sql = `INSERT INTO customer (name, c_type, address, contact, nid, email, g_name, g_address, g_contact, g_nid, balance)
        VALUES ("${name}", "${c_type}", "${p_address}", "${contact}", "${NID}", "${email}", "${g_name}", "${g_address}", "${g_contact}", "${G_NID}", "${balance}")`;
        con.query(sql, (err, result) => {
          let sql = `SELECT * FROM customer`;
          con.query(sql, (err, result) => {
            res.render("customer", {
              successMsg: "New customer added successfully!",
              message: result,
              title: "Customer",
            });
          });
        });
      } else {
        let sql = `SELECT * FROM customer`;
        con.query(sql, (err, result) => {
          res.render("customer", {
            errorMessage:
              "Customer with the same name or contact already exists!",
            message: result,
            title: "Customer",
          });
        });
      }
    });
  });



customer.post("/edit", (req, res) => {
  let cid = req.body.cid;
  console.log(cid)
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `SELECT * FROM customer WHERE id = "${cid}"`;
  con.query(sql, (err, result) => {
    let html = `<form action="/customer/edit_update" method="POST">
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

customer.post("/edit_update", (req, res) => {
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
  console.log(cid);

  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `UPDATE customer SET name = "${name}", address = "${p_address}", contact = "${contact}", nid = "${NID}", email = "${email}", g_name = "${g_name}", g_address = "${g_address}", g_nid = "${G_NID}", g_contact = "${g_contact}" WHERE id = "${cid}"`;
  con.query(sql, (err, result) => {
    let sql = `SELECT * FROM customer`;
    con.query(sql, (err, result) => {
      res.render("customer", {
        successMsg: "Customer updated successfully!",
        message: result,
        title: "Customer",
      });
    });
  });
});

customer.post("/customer_delete", (req, res) => {
  let cid = req.body.cid;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  
  let sql = `DELETE FROM customer WHERE id = "${cid}"`;
  con.query(sql, (err, result) => {
    
    let sql = `SELECT * FROM customer`;
    con.query(sql, (err, result) => {
      res.render("customer", {
        successMsg: "Customer removed successfully!",
        message: result,
        title: "Customer",
      });
    });
  });
});

customer.post("/customer_search", (req, res) => {
  let SI = req.body.SI;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `SELECT * FROM customer WHERE name LIKE "%${SI}%" OR contact LIKE "%${SI}%"`;
  con.query(sql, (err, result) => {
    if (result.length <= 0) {
      res.send("No customer found!");
    } else {
      res.send(result);
    }
  });
});

module.exports = customer;

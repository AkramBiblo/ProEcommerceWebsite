const express = require("express");
const accounts = express.Router();
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

accounts.get("/supplierPayments", (req, res) => {
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `SELECT * FROM supplier`;
    con.query(sql, (err, result) => {
      let supplier = result;
      let sql = `SELECT * FROM payments WHERE payment_type = "supplier_payment" ORDER BY id DESC LIMIT 10`
      con.query(sql, (err, result) => {
        res.render("supplier_payments", {
          supplier: supplier,
          payments: result,
          title: "Payments",
        });
      })
    });
});

accounts.post("/payToSupplier", (req, res) => {
  let supplier = req.body.supplier;
  let amount = req.body.amount;
  let balance = req.body.Cbalance;
  let comment = req.body.comment;
  let date = req.body.date;
  Pay(supplier, amount, comment, date, "supplier_payment")
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `UPDATE supplier SET balance = "${balance}" WHERE name = "${supplier}"`;
  con.query(sql, (err, result) => {
    let sql = `SELECT * FROM supplier`;
    con.query(sql, (err, result) => {
      let supplier = result;
      let sql = `SELECT * FROM payments WHERE payment_type = "supplier_payment"`
      con.query(sql, (err, result) => {
        res.render("supplier_payments", {
          supplier: supplier,
          payments: result,
          title: "Payments",
        });
      })
    });
  });
})

function Pay(r, a, c, d, t) {
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `INSERT INTO payments (receiver, amount, comment, date, payment_type)
    VALUE ("${r}", "${a}", "${c}", "${d}", "${t}")`
    con.query(sql, (err, result) => {});
  }


module.exports = accounts;

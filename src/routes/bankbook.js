const express = require("express");
const bankbook = express.Router();
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const { resolve } = require("path");
const e = require("express");
bankbook.use(cookieParser());
// create application/json parser
var jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: true });

const getDBInfo = require("../../db");
const con = getDBInfo.con;
bankbook.get("/", (req, res) => {
 let sql = `SELECT * FROM bankbook`;
 con.query(sql, (err, result) => {
   res.render("bankbook", {
     message: result,
     title: "bankbook",
   });
 });
});

bankbook.post("/new_bank_upload", (req, res) => {
    let name = req.body.bank_nm;
    let branch = req.body.branch;
    let ac_nr = req.body.ac_nr;
    let ac_nm = req.body.ac_nm;
    let balance = req.body.balance;

    const getDBInfo = require("../../db");
    const con = getDBInfo.con;
    spl_query = `SELECT * FROM bankbook WHERE ac_nr = "${ac_nr}"`;
    con.query(spl_query, (err, result) => {
      if (result.length <= 0) {
        let sql = `INSERT INTO bankbook (name, branch, ac_nr, ac_nm, balance) VALUES ("${name}", "${branch}", "${ac_nr}", "${ac_nm}", "${balance}")`;
        con.query(sql, (err, result) => {
          let sql = `SELECT * FROM bankbook`;
          con.query(sql, (err, result) => {
            res.render("bankbook", {
              successMsg: "New Bank added successfully!",
              message: result,
              title: "bankbook",
            });
          });
        });
      } else {
        let sql = `SELECT * FROM bankbook`;
        con.query(sql, (err, result) => {
          res.render("bankbook", {
            errorMessage: "This Bank is already exist!",
            message: result,
            title: "bankbook",
          });
        });
      }
    });
});

bankbook.post("/bank_search", (req, res) => {
  let SI = req.body.SI;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `SELECT * FROM bankbook WHERE name LIKE "%${SI}%" || ac_nr LIKE "%${SI}%" || ac_nm LIKE "%${SI}%"`;
  con.query(sql, (err, result) => {
    if (result.length <= 0) {
      res.send("No company found!");
    } else {
      res.send(result);
    }
  });
});


module.exports = bankbook;

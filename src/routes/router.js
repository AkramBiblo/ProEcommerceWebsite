const express = require("express");
const router = express.Router();
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const { resolve } = require("path");
router.use(cookieParser());
// create application/json parser
var jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: true });

router.get("/", (req, res) => {
  res.render("admin", {
    title: "admin",
  });
});
router.get("/basic_module", (req, res) => {
  res.render("basic_module", { title: "Modules" });
});
router.get("/companies", (req, res) => {
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `SELECT * FROM basic_company`;
  con.query(sql, (err, result) => {
    res.render("companies", {
      message: result,
      title: "Companies",
    });
  });
});
router.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact" });
});
router.get("/he2023admin", (req, res) => {
  res.render("admin", { title: "admin" });
});
router.get("/forms_2", (req, res) => {
  res.render("form_2", { title: "forms" });
});
router.get("/forms", (req, res) => {
  res.render("forms", { title: "forms" });
});
router.get("/dealership", (req, res) => {
  res.render("dealership", { title: "Dealership" });
});
router.get("/store", (req, res) => {
  if (req.cookies.HEStore === undefined) {
    res.render("storeLogin", { title: "Store Login" });
  } else {
    res.render("store", { title: "Store Login" });
  }
});

router.post("/basic_new_company_upload", (req, res) => {
  let name = req.body.name;
  let address = req.body.address;
  let mobile = req.body.mobile;

  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `INSERT INTO basic_company (name, address, mobile) VALUES ("${name}", "${address}", "${mobile}")`;
  con.query(sql, (err, result) => {
    res.send("New company added successfully!")
  })
});

router.post("/basic_company_delete", (req, res) => {
  let cid = req.body.cid;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `DELETE FROM basic_company WHERE id = "${cid}"`;
  con.query(sql, (err, result) => {
    res.send("Company removed successfully!");
  });
});


module.exports = router;

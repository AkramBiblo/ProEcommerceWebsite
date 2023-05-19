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
router.get("/services", (req, res) => {
  res.render("services", { title: "Services" });
});
router.get("/about", (req, res) => {
  res.render("about", { title: "About" });
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

module.exports = router;

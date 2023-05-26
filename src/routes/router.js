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
  let sql = `SELECT * FROM basic_module WHERE module = "company"`;
  con.query(sql, (err, result) => {
    res.render("basic_companies", {
      message: result,
      title: "Companies",
    });
  });
});
router.get("/categories", (req, res) => {
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `SELECT * FROM basic_module WHERE module = "category"`;
  con.query(sql, (err, result) => {
    res.render("basic_categories", {
      message: result,
      title: "Categories",
    });
  });
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
  let sql = `INSERT INTO basic_module (module, name, address, mobile) VALUES ("company", "${name}", "${address}", "${mobile}")`;
  con.query(sql, (err, result) => {
    let sql = `SELECT * FROM basic_module`;
    con.query(sql, (err, result) => {
      res.render("basic_companies", {
        successMsg: "New company added successfully!",
        message: result,
        title: "Companies",
      });
    });
    // res.send("New company added successfully!")
  })
});

router.post("/basic_new_category_upload", (req, res) => {
  let name = req.body.name;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `INSERT INTO basic_module (module, name) VALUES ("category", "${name}")`;
  con.query(sql, (err, result) => {
    let sql = `SELECT * FROM basic_module WHERE module = "category"`;
    con.query(sql, (err, result) => {
      res.render("basic_categories", {
        successMsg: "New category added successfully!",
        message: result,
        title: "Categories",
      });
    });
  })
});

router.post("/basic_company_delete", (req, res) => {
  let cid = req.body.cid;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `DELETE FROM basic_module WHERE id = "${cid}"`;
  con.query(sql, (err, result) => {
    let sql = `SELECT * FROM basic_module`;
    con.query(sql, (err, result) => {
      res.render("basic_companies", {
        successMsg: "Company removed successfully!",
        message: result,
        title: "Companies",
      });
    });
    // res.send("Company removed successfully!");
  });
});

router.post("/basic_category_delete", (req, res) => {
  let cid = req.body.cid;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `DELETE FROM basic_module WHERE id = "${cid}"`;
  con.query(sql, (err, result) => {
    let sql = `SELECT * FROM basic_module WHERE module = "category"`;
    con.query(sql, (err, result) => {
      res.render("basic_categories", {
        successMsg: "Category removed successfully!",
        message: result,
        title: "Category",
      });
    });
    // res.send("Company removed successfully!");
  });
});

router.post("/basic_company_edit", (req, res) => {
  let cid = req.body.cid;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `SELECT * FROM basic_module WHERE id = "${cid}"`;
  con.query(sql, (err, result) => {
    res.send(result[0]);
  });
});

router.post("/basic_category_edit", (req, res) => {
  let cid = req.body.cid;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `SELECT * FROM basic_module WHERE id = "${cid}"`;
  con.query(sql, (err, result) => {
    res.send(result[0]);
  });
});

router.post("/basic_edit_company_update", (req, res) => {
  let cid = req.body.cid;
  let name = req.body.name;
  let address = req.body.address;
  let mobile = req.body.mobile;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `UPDATE basic_module SET name = "${name}", address = "${address}", mobile = "${mobile}" WHERE id = "${cid}"`;
  con.query(sql, (err, result) => {
    let sql = `SELECT * FROM basic_module`;
    con.query(sql, (err, result) => {
      res.render("basic_companies", {
        successMsg: "Company updated successfully!",
        message: result,
        title: "Companies",
      });
    });
    // res.send("Company removed successfully!");
  });

});

router.post("/basic_edit_category_update", (req, res) => {
  let cid = req.body.cid;
  let name = req.body.name;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `UPDATE basic_module SET name = "${name}" WHERE id = "${cid}"`;
  con.query(sql, (err, result) => {
    let sql = `SELECT * FROM basic_module WHERE module = "category"`;
    con.query(sql, (err, result) => {
      res.render("basic_categories", {
        successMsg: "Category updated successfully!",
        message: result,
        title: "Categories",
      });
    });
  });

});

router.post("/basic_company_search", (req, res) => {
  let SI = req.body.SI;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `SELECT * FROM basic_module WHERE name LIKE "%${SI}%"`;
  con.query(sql, (err, result) => {
    if (result.length <= 0) {
      res.send("No company found!")
    } else {
      res.send(result[0]);
    }
  });
});

router.post("/basic_category_search", (req, res) => {
  let SI = req.body.SI;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `SELECT * FROM basic_module WHERE name LIKE "%${SI}%"`;
  con.query(sql, (err, result) => {
    if (result.length <= 0) {
      res.send("No company found!");
    } else {
      res.send(result[0]);
    }
  });
});



module.exports = router;

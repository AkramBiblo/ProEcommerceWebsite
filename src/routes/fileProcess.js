const express = require("express");
const fileProcess = express.Router();
const multer = require("multer");
// const upload = multer({ dest: './src/uploadedFiles/' })
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

const getDBInfo = require("../../db");
const { resolve, dirname } = require("path");
const con = getDBInfo.con;

fileProcess.post(
  "/fileProcess",
  urlencodedParser,
  upload.array("ProductPics", 3),
  function (req, res) {
    let File_1 = req.files[0].filename;
    let File_2 = req.files[1].filename;
    let File_3 = req.files[2].filename;
    let Title = req.body.Title;
    let KeyWords = req.body.KeyWords;
    let Type = req.body.Type;
    let Category = req.body.category;
    let Brand = req.body.brand;
    let Color = req.body.color;
    let Barcode = req.body.barcode;
    let MRP = req.body.MRP;
    let Qty = req.body.Qty;
    let Warranty = req.body.warranty;
    let DMRP = req.body.DMRP;
    let Description = req.body.FullDesc;
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    let date = new Date();
    let d = date.getDate();
    let m = months[date.getMonth()];
    let y = date.getFullYear();
    let time = d + "-" + m + "-" + y;
    const getDBInfo = require("../../db");
    const { resolve } = require("path");
    const con = getDBInfo.con;
    con.connect(function (err) {
      let searchQuery = `SELECT * FROM products WHERE name = "${Title}"`;
      con.query(searchQuery, (err, result) => {
        if (result.length <= 0) {
          let sql = `INSERT INTO products (name, type, category, brand, color, barcode, Qty, mrp, description, warranty, File_1, File_2, File_3, demo_MRP, keywords)
            VALUES ("${Title}", "${Type}", "${Category}", "${Brand}", "${Color}", "${Barcode}", "${Qty}", "${MRP}", "${Description}", "${Warranty}", "${File_1}", "${File_2}", "${File_3}", "${DMRP}", "${KeyWords}")`;

          con.query(sql, (err, result) => {
            res.render("forms", {
              successMsg: "Product uploaded seccessfully!!!",
            });
          });
        } else {
          res.render("forms", {
            errorMessage: "This product is already uploaded",
          });
        }
      });

      // let sql = `INSERT INTO products (name, type, category, brand, color, barcode, Qty, mrp, description, warranty, File_1, File_2, File_3, demo_MRP, keywords)
      // VALUES ("${Title}", "${Type}", "${category}", "${brand}", "${color}", "${barcode}", "${Qty}", "${MRP}", "${description}", "${warranty}", "${File_1}", "${File_2}", "${File_3}", "${DMRP}", "${KeyWords}")`

      // con.query(sql, (err, result) => {
      //   res.render('forms', {successMsg: 'Product uploaded seccessfully!!!'})
      // })
    });
  }
);

fileProcess.post("/fileProcess_2", function (req, res) {
  let Title = req.body.Title;
  let Type = req.body.Type;
  // let Category = req.body.category;
  let Brand = req.body.brand;
  let Color = req.body.color;
  let Qty = req.body.Qty;
  const getDBInfo = require("../../db");
  const { resolve } = require("path");
  const con = getDBInfo.con;
  con.connect(function (err) {
    let searchQuery = `SELECT * FROM products_store WHERE name = "${Title}"`;
    con.query(searchQuery, (err, result) => {
      if (result.length <= 0) {
        let sql = `INSERT INTO products_store (name, type, brand, color, Qty)
          VALUES ("${Title}", "${Type}", "${Brand}", "${Color}", "${Qty}")`;

        con.query(sql, (err, result) => {
          res.render("form_2", {
            successMsg: "Product uploaded seccessfully!!!",
          });
        });
      } else {
        res.render("form_2", {
          errorMessage: "This product is already uploaded",
        });
      }
    });

    // let sql = `INSERT INTO products (name, type, category, brand, color, barcode, Qty, mrp, description, warranty, File_1, File_2, File_3, demo_MRP, keywords)
    // VALUES ("${Title}", "${Type}", "${category}", "${brand}", "${color}", "${barcode}", "${Qty}", "${MRP}", "${description}", "${warranty}", "${File_1}", "${File_2}", "${File_3}", "${DMRP}", "${KeyWords}")`

    // con.query(sql, (err, result) => {
    //   res.render('forms', {successMsg: 'Product uploaded seccessfully!!!'})
    // })
  });
});

fileProcess.post(
  "/editImage",
  urlencodedParser,
  upload.single("img_input"),
  (req, res) => {
    let PID = req.body.pid;
    let img = req.body.img;
    let imgName = req.body.imgName;
    let file = req.file.filename;
    Number(img);
    let fileContainer;
    if (img == 1) {
      fileContainer = "File_1";
    } else if (img == 2) {
      fileContainer = "File_2";
    } else {
      fileContainer = "File_3";
    }
    let f = path.join(__dirname, `../../public/uploadedFiles/${imgName}`);
    if (fs.existsSync(f) == true) {
      fs.unlink(f, (err) => {});
    }
    const getDBInfo = require("../../db");
    const con = getDBInfo.con;
    con.connect((err) => {
      let sql = `UPDATE products SET ${fileContainer} = '${file}' WHERE Id = ${PID}`;
      con.query(sql, (err, result) => {
        let sql = `SELECT * FROM products WHERE Id = ${PID}`;
        con.query(sql, (err, result) => {
          if (result.length <= 0) {
            res.send({ emptyResult: `Unexpected server error occurred` });
          } else {
            res.render("editProduct", {
              message: result[0],
              title: "Edit Product",
              successMsg: "Image replaced successfully!",
            });
          }
        });
      });
    });
  }
);

module.exports = fileProcess;

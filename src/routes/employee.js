const express = require("express");
const register = express.Router();
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

register.post(
  "/new",
  urlencodedParser,
  upload.single("avatar"),
  function (req, res) {
    let name = req.body.name;
    let DOB = req.body.DOB;
    let p_address = req.body.p_address;
    let pm_address = req.body.pm_address;
    let designation = req.body.designation;
    let department = req.body.department;
    let EICP = req.body.EICP;
    let j_date = req.body.j_date;
    let qualifications = req.body.qualifications;
    let last_company = req.body.last_company;
    let DILC = req.body.DILC;
    let NID = req.body.NID;
    let mobile = req.body.mobile;
    let file = req.file.filename;
    
     const getDBInfo = require("../../db");
     const con = getDBInfo.con;
     let sql = `INSERT INTO employee (name, DOB, p_address, pm_address, designation, department, EICP, j_date, qualifications, last_company, DILC, NID, mobile, file)
     VALUES ("${name}", "${DOB}", "${p_address}", "${pm_address}", "${designation}", "${department}", "${EICP}", "${j_date}", "${qualifications}", "${last_company}", "${DILC}", "${NID}", "${mobile}", "${file}")`;
     con.query(sql, (err, result) => {
        let sql = `SELECT * FROM employee`;
        con.query(sql, (err, result) => {
          res.render("employee", {
            successMsg:"New employee added successfully!",
            message: result,
            title: "Employee",
          });
        });
     });

  }
);

register.get("/", (req, res) => {
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `SELECT * FROM employee`;
  con.query(sql, (err, result) => {
    res.render("employee", {
      message: result,
      title: "Employee",
    });
  });
});

register.post("/edit", (req, res) => {
  let cid = req.body.cid;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `SELECT * FROM employee WHERE id = "${cid}"`;
  con.query(sql, (err, result) => {
    let html = `<form action="/employee/edit_update" method="POST">
              <div class="container mt-2">
                  <div class="row mt-2">
                      
                      <div class="col">
                          
                          <div class="row mt-3">
                              <div class="col-lg-4">
                                  <h6><label for="p_address">Present Address</label></h6>
                              </div>
                              <div class="col-lg-8">
                                  <input type="text" class="form-control" name="p_address" value="${result[0].p_address}">
                              </div>
                          </div>
                          <div class="row mt-3">
                              <div class="col-lg-4">
                                  <h6><label for="pm_address">Permanent Address</label></h6>
                              </div>
                              <div class="col-lg-8">
                                  <input type="text" class="form-control" name="pm_address" value="${result[0].pm_address}">
                              </div>
                          </div>
                          <div class="row mt-3">
                              <div class="col-lg-4">
                                  <h6><label for="designation">Designation</label></h6>
                              </div>
                              <div class="col-lg-8">
                                  <input type="text" class="form-control" name="designation" value="${result[0].designation}">
                              </div>
                          </div>
                          <div class="row mt-3">
                              <div class="col-lg-4">
                                  <h6><label for="department">Department</label></h6>
                              </div>
                              <div class="col-lg-8">
                                  <input type="text" class="form-control" name="department" value="${result[0].department}">
                              </div>
                          </div>
                          <div class="row mt-3">
                              <div class="col-lg-4">
                                  <h6><label for="mobile">Contact</label></h6>
                              </div>
                              <div class="col-lg-8">
                                  <input type="text" class="form-control" name="mobile" value="${result[0].mobile}">
                              </div>
                          </div>
                        </div>
                        <div class="col">
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

register.post("/edit_update", (req, res) => {
  let cid = req.body.cid;
  let p_address = req.body.p_address;
  let pm_address = req.body.pm_address;
  let designation = req.body.designation;
  let department = req.body.department;

  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `UPDATE employee SET p_address = "${p_address}", pm_address = "${pm_address}", designation = "${designation}", department = "${department}" WHERE id = "${cid}"`;
  con.query(sql, (err, result) => {
    let sql = `SELECT * FROM employee`;
    con.query(sql, (err, result) => {
      res.render("employee", {
        successMsg: "Employee updated successfully!",
        message: result,
        title: "Employee",
      });
    });
  });
});

register.post("/employee_delete", (req, res) => {
  let cid = req.body.cid;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  
  let sql_ = `SELECT * FROM employee WHERE id = ${cid}`;
  con.query(sql_, (err, result) => {
    let imgName = result[0].file;
    let f = path.join(__dirname,`../../public/uploadedFiles/${imgName}`);
            if (fs.existsSync(f) == true) {
              fs.unlink(f, (err) => {})
            }
  });

  let sql = `DELETE FROM employee WHERE id = "${cid}"`;
  con.query(sql, (err, result) => {
    
    let sql = `SELECT * FROM employee`;
    con.query(sql, (err, result) => {
      res.render("employee", {
        successMsg: "Employee removed successfully!",
        message: result,
        title: "Employee",
      });
    });
  });
});



module.exports = register;

const express = require("express");
const purchase = express.Router();
const multer = require("multer");
// const upload = multer({ dest: './src/uploadedFiles/' })
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
var bodyParser = require("body-parser");
const e = require("express");
const { match } = require("assert");
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

purchase.post("/getStock", (req, res) => {
  let model = req.body.model;
    const getDBInfo = require("../../db");
    const con = getDBInfo.con;
    let sql = `SELECT * FROM purchase WHERE model = "${model}" AND status = "stock"`;
    con.query(sql, (err, result) => {
      res.send(result)
    });
})

purchase.post("/check_bc", (req, res) => {
  let newbc = req.body.barcode_;
  let arr = JSON.parse(newbc)
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    function funMatchedBc(bc) {
      if (arr.includes(bc)) {
        return true;
      } else {
        return false;
      }
      
    }
    let sql = `SELECT * FROM purchase`
    con.query(sql, (err, result) => {
      if (result.length > 0) {
        let matchedBc = []
        for (let i = 0; i < result.length; i++) {
          const e = result[i];
          let bc = e.barcode
          let _matchBc = funMatchedBc(bc)
          if (_matchBc == true) {
            matchedBc.push(bc)
          } 
        }
        if (matchedBc.length > 0) {
          res.send({existingBc: matchedBc})
        } else {
          res.send({existingBc:"BC_OK"})
        }
      } else {
        res.send({existingBc:"BC_OK"})
      }
    })
  })
})



purchase.post("/new", (req, res) => {
    const getDBInfo = require("../../db");
    const con = getDBInfo.con;
    
    let _data = req.body.data;
    let part = _data.slice(0, -1);
    let array = part.split("+,")
    let net_total = 0;
    let _invoice = "";
    let _supplier = "";
    let _pur_date = "";
    let _qty = 0;
    for (let i = 0; i < array.length; i++) {
      const e = array[i];
      let a = e.slice(0, -1)
      let productArray = a.split(",")
      let bc = e.split(",")
      for (let i = 0; i < 11; i++) {
        bc.pop()
      }
      for (let i = 0; i < 2; i++) {
        bc.shift()
      }

      let model = productArray[0]
      let qty = productArray[1]
      _qty += Number(qty)
      let barcode = bc;
      let pur_date = productArray[productArray.length -10]
      _pur_date = pur_date;
      // let challan = productArray[4]
      let invoice = productArray[productArray.length - 9]
      _invoice = invoice;
      let supplier = productArray[productArray.length -8]
      _supplier = supplier;
      let godown = productArray[productArray.length -7]
      let color = productArray[productArray.length -6]
      // let prev_stock = productArray[9]
      let pur_rate = productArray[productArray.length -4]
      let mrp = productArray[productArray.length -3]
      let disc_per = productArray[productArray.length -2]
      let flat_disc = productArray[productArray.length -1]
      

      let cal = (Number(mrp) / 100) * Number(disc_per);
      let disc_amt = cal

      let total_pur_rate = Number(qty) * Number(pur_rate)
      net_total += total_pur_rate;
      
      for (let i = 0; i < barcode.length; i++) {
        const e = barcode[i];
        let sqlRemoveQry = `SELECT * FROM purchase WHERE barcode = "${e}"`
        con.query(sqlRemoveQry, (err, result) => {
          if (result.length > 0) {
            let sql = `DELETE FROM purchase WHERE barcode = "${e}"`
            con.query(sql, (err, result) => {
              let sql = `INSERT INTO purchase (date, supplier, invoice_no, model, godown, color, pur_rate, disc_per, mrp, disc_amt, flat_disc_amount, barcode, status)
                  VALUES ("${pur_date}", "${supplier}", "${invoice}", "${model}", "${godown}", "${color}", "${pur_rate}", "${disc_per}", "${mrp}", "${disc_amt}", "${flat_disc}", "${e}", "Stock")`;
                  con.query(sql, (err, result) => {
                    
                  })
            })
          } else {
            let sql = `INSERT INTO purchase (date, supplier, invoice_no, model, godown, color, pur_rate, disc_per, mrp, disc_amt, flat_disc_amount, barcode, status)
            VALUES ("${pur_date}", "${supplier}", "${invoice}", "${model}", "${godown}", "${color}", "${pur_rate}", "${disc_per}", "${mrp}", "${disc_amt}", "${flat_disc}", "${e}", "Stock")`;
            con.query(sql, (err, result) => {
              
            })
          }
        })
      }
    }
    // Challan
    let sql = `SELECT * FROM purchase_challan WHERE invoice_no = "${_invoice}"`
      con.query(sql, (err, result) => {
        if (result.length > 0) {
          let sql_ = `DELETE FROM purchase_challan WHERE invoice_no = "${_invoice}"`
                      con.query(sql_, (err, result) => {
                        let sql = `INSERT INTO purchase_challan (invoice_no, pur_date, net_total, supplier, qty)
                        VALUES ("${_invoice}", "${_pur_date}", "${net_total}", "${_supplier}", "${_qty}")`
                        con.query(sql, (err, result) => {
                          res.send({ prodUpdatSuccessMsg: "Purchase updated successfully!!!" })
                        })
                      })
        } else {
          let sql = `INSERT INTO purchase_challan (invoice_no, pur_date, net_total, supplier, qty)
                        VALUES ("${_invoice}", "${_pur_date}", "${net_total}", "${_supplier}", "${_qty}")`
                        con.query(sql, (err, result) => {
                          res.send({ prodUpdatSuccessMsg: "Purchase updated successfully!!!" })
                        })
        }
      })
  });

purchase.post("/challan", (req, res) => {
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = "SELECT * FROM purchase_challan"
    con.query(sql, (err, result) => {
      res.send(result)
    })
  })
})

purchase.post("/challan/edit", (req, res) => {
  let invoice = req.body.invoice;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM purchase WHERE invoice_no = "${invoice}"`
    con.query(sql, (err, result) => {
      res.send(result)
     
    })
  })
})

purchase.post("/challan/edit/getData", (req, res) => {
  let invoice = req.body.invoice;
  let model = req.body.model;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM purchase WHERE invoice_no = "${invoice}" AND model = "${model}"`
    con.query(sql, (err, result) => {
      res.send(result)
    })
  })
})

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

purchase.post("/invoice_search", (req, res) => {
  let invoice = req.body.SI;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `SELECT * FROM purchase_challan WHERE invoice_no = "${invoice}"`;
  con.query(sql, (err, result) => {
    if (result.length <= 0) {
      res.send("No challan found!");
    } else {
      res.send(result);
    }
  });
});

purchase.post("/remove_invoice", (req, res) => {
  let invoice = req.body.invoice;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  
  let sql = `DELETE FROM purchase_challan WHERE invoice_no = "${invoice}"`;
  con.query(sql, (err, result) => {
    let sql_2 = `DELETE FROM purchase WHERE invoice_no = "${invoice}"`;
    con.query(sql_2, (err, result) => {
      res.send (`Challan removed successfully! <a href="/purchase">Go to Purchase</a>`)
    });
  });
})

purchase.post("/edit_invoice", (req, res) => {
  let invoice = req.body.invoice;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `SELECT * FROM purchase WHERE invoice_no = "${invoice}"`;
  con.query(sql, (err, result) => {
    
    
  });
});

module.exports = purchase;
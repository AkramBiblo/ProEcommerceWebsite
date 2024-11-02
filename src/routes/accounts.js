const express = require("express");
const accounts = express.Router();
const multer = require("multer");
// const upload = multer({ dest: './src/uploadedFiles/' })
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
var bodyParser = require("body-parser");
const { get } = require("http");
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

accounts.get("/customer_cash_collection", (req, res) => {
    const getDBInfo = require("../../db");
    const con = getDBInfo.con;
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth()
    month+=1
    let fDay = `${year}-${month}-01`
    let now = `${year}-${month}-31`
    let sql = `SELECT * FROM customer_cash_collection WHERE date BETWEEN "${fDay}" AND "${now}" ORDER BY id DESC`
    con.query(sql, (err, result) => {
      res.render("customer_cash_collection", {title: "Cash Collection", payments: result})
    })
})

accounts.post("/customer_cash_collection", (req, res) => {
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
    let cid = req.body.cid
    let coll_id = req.body.coll_id;
    let cName = req.body.cName;
    let cAddress = req.body.cAddress;
    let amount = req.body.amount
    let currentBalance = req.body.currentBalance
    let date = req.body.date
    let comment = req.body.comment
    let isEditing = req.body.isEditing;

    if (isEditing == "True") {
      let sql = `SELECT * FROM customer_cash_collection WHERE id = "${coll_id}"`
        con.query(sql, (err, result) => {
            let cid_ = result[0].cid;
            let coll_amount = result[0].amount;
            if (cid_ !== cid) {
              let sql = `SELECT * FROM customer WHERE customer_id = "${cid_}"`;
              con.query(sql, (err, result) => {
                let c_balance = result[0].balance;
                let updatedBalance = Number(c_balance) + Number(coll_amount)
                let updateQuery = `UPDATE customer SET balance = "${updatedBalance}" WHERE customer_id = "${cid_}"`
                con.query(updateQuery, (err, result) => {
                  let sql_1 = `UPDATE customer_cash_collection SET cid = "${cid}", cName = "${cName}", cAddress = "${cAddress}", amount = "${amount}", date = "${date}", comment = "${comment}" WHERE id = "${coll_id}"`
                  con.query(sql_1, (err, result) => {
                    let date = new Date()
                  let year = date.getFullYear()
                  let month = date.getMonth()
                  month+=1
                  let fDay = `${year}-${month}-01`
                  let now = `${year}-${month}-31`
                  let sql = `SELECT * FROM customer_cash_collection WHERE date BETWEEN "${fDay}" AND "${now}" ORDER BY id DESC`
                  con.query(sql, (err, result) => {
                    res.send(result)
                    // res.send({paymentData: result, successMsg:"Cash collection updated successfully!"})
                    // res.render("customer_cash_collection", {title: "Cash Collection", payments: result})
                  })
                    
                    updateCustomerBalance(cid, currentBalance)
                  })
                })
              })
            }
        })
      // sql_1 = `UPDATE customer_cash_collection SET cid = "${cid}", cName = "${cName}", cAddress = "${cAddress}", amount = "${amount}", date = "${date}", comment = "${comment}" WHERE id = "${coll_id}"`
    } else {
      let sql_1 = `INSERT INTO customer_cash_collection (cid, cName, cAddress, amount, date, comment) VALUES ("${cid}", "${cName}", "${cAddress}", "${amount}", "${date}", "${comment}")`
      con.query(sql_1, (err, result) => {
        let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth()
      month+=1
      let fDay = `${year}-${month}-01`
      let now = `${year}-${month}-31`
      let sql = `SELECT * FROM customer_cash_collection WHERE date BETWEEN "${fDay}" AND "${now}" ORDER BY id DESC`
      con.query(sql, (err, result) => {
        res.send(result)
        // res.send({paymentData: result, successMsg:"Cash collection updated successfully!"})
        // res.render("customer_cash_collection", {title: "Cash Collection", payments: result})
      })
        
        updateCustomerBalance(cid, currentBalance)
      })
    }

    
})

accounts.post("/removeCashColl", (req, res) => {
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let coll_id = req.body.coll_id;
  let sql = `SELECT * FROM customer_cash_collection WHERE id = "${coll_id}"`
  con.query(sql, (err, result) => {
    let cid = result[0].cid;
    let coll_amount = result[0].amount;
    let sql = `SELECT * FROM customer WHERE customer_id = "${cid}"`;
              con.query(sql, (err, result) => {
                let c_balance = result[0].balance;
                let updatedBalance = Number(c_balance) + Number(coll_amount)
                let updateQuery = `UPDATE customer SET balance = "${updatedBalance}" WHERE customer_id = "${cid}"`
                con.query(updateQuery, (err, result) => {
                  let sql_1 = `DELETE FROM customer_cash_collection WHERE id = "${coll_id}"`
                  con.query(sql_1, (err, result) => {
                    let date = new Date()
                  let year = date.getFullYear()
                  let month = date.getMonth()
                  month+=1
                  let fDay = `${year}-${month}-01`
                  let now = `${year}-${month}-31`
                  let sql = `SELECT * FROM customer_cash_collection WHERE date BETWEEN "${fDay}" AND "${now}" ORDER BY id DESC`
                    con.query(sql, (err, result) => {
                      if (result.length > 0) {
                        res.send(result)
                      } else {
                        res.send("No collection available!")
                      }
                    })
                  })
                })
              })

  })

})

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
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let isEditing = req.body.isEditing;
  let supplier = req.body.supplier;
  let supplier_id = req.body.supplier_id;
  let amount = req.body.amount;
  let balance = req.body.Cbalance;
  let comment = req.body.comment;
  let date = req.body.date;
  
  if (isEditing == "True") {
    let reservedSupplier_id = req.body.reservedSupplier_id
    let reservedAmountForEdit = req.body.reservedAmountForEdit;
    supplier = req.body.selected_supplier;
    let paymentId = req.body.reservedPaymentIdForEdit;
    
    let sql = `UPDATE payments SET receiver = "${supplier}", receiver_id = "${supplier_id}", amount = "${amount}", comment = "${comment}", date = "${date}" WHERE id = "${paymentId}"`
        con.query(sql, (err, result) => {
          if (reservedSupplier_id !== supplier_id) {
           let getSup = `SELECT * FROM supplier WHERE supplier_id = "${reservedSupplier_id}"`
           con.query(getSup, (err, result) => {
            let prevBalance = result[0].balance;
            let UpdatedBalance = Number(prevBalance) - Number(reservedAmountForEdit)
            let updateQry = `UPDATE supplier SET balance = "${UpdatedBalance}" WHERE supplier_id = "${reservedSupplier_id}"`
            con.query(updateQry, (err, result) => {})
           })
          }
          let sql = `UPDATE supplier SET balance = "${balance}" WHERE supplier_id = "${supplier_id}"`;
          con.query(sql, (err, result) => {
            let sql = `SELECT * FROM supplier`;
            con.query(sql, (err, result) => {
              let supplier = result;
              let sql = `SELECT * FROM payments WHERE payment_type = "supplier_payment" ORDER BY id DESC`
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
  } else {
    Pay(supplier_id, supplier, amount, comment, date, "supplier_payment")
    
    let sql = `UPDATE supplier SET balance = "${balance}" WHERE supplier_id = "${supplier_id}"`;
    con.query(sql, (err, result) => {
      let sql = `SELECT * FROM supplier`;
      con.query(sql, (err, result) => {
        let supplier = result;
        let sql = `SELECT * FROM payments WHERE payment_type = "supplier_payment" ORDER BY id DESC`
        con.query(sql, (err, result) => {
          res.render("supplier_payments", {
            supplier: supplier,
            payments: result,
            title: "Payments",
          });
        })
      });
    });
  }
 
})

accounts.post("/searchPaymentInfo", (req, res) => {
  let from_date = req.body.from_date;
  let to_date = req.body.to_date
 
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  
  let sql = `SELECT * FROM customer_cash_collection WHERE date BETWEEN "${from_date}" AND "${to_date}" ORDER BY id DESC`
    con.query(sql, (err, result) => {
      res.send(result)
    })
})

accounts.post("/getCollectionForEdit", (req, res) => {
  let collId = req.body.collId;

  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `SELECT * FROM customer_cash_collection WHERE id = "${collId}"`
    con.query(sql, (err, result) => {
      let cid = result[0].cid;
      let cCollData = result[0]
      let sql = `SELECT * FROM customer WHERE customer_id = "${cid}"`;
      con.query(sql, (err, result) => {
        let data = [cCollData, result[0]]
        res.send(data)
      })
    })
})

accounts.post("/getPaymentDataForEdit", (req, res) => {
  let paymentId = req.body.paymentId;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `SELECT * FROM payments WHERE id = "${paymentId}"`
    con.query(sql, (err, result) => {
      let receiver_id = result[0].receiver_id;
      let paymentData = result[0];
      let sql = `SELECT * FROM supplier WHERE supplier_id = "${receiver_id}"`;
      con.query(sql, (err, result) => {
        let data = [paymentData, result[0]]
        res.send(data)
      })
    })
})

accounts.post("/removePayment", (req, res) => {
  let paymentId = req.body.paymentId;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `SELECT * FROM payments WHERE id = "${paymentId}"`
    con.query(sql, (err, result) => {
      let receiver_id = result[0].receiver_id;
      let paidAmount = result[0].amount;
      let sql = `SELECT * FROM supplier WHERE supplier_id = "${receiver_id}"`;
      con.query(sql, (err, result) => {
        let queryBalance = result[0].balance;
        let balance = Number(queryBalance) - Number(paidAmount);
        let updateQuery = `UPDATE supplier SET balance = "${balance}" WHERE supplier_id = "${receiver_id}"`
        con.query(updateQuery, (err, result) => {
          let deleteQuery = `DELETE FROM payments WHERE id = "${paymentId}"`
          con.query(deleteQuery, (err, result) => {
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
          })
          
        })
      })
    })
})

function updateCustomerBalance(cid, currentBalance) {
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `UPDATE customer SET balance = "${currentBalance}" WHERE customer_id = "${cid}"`
    con.query(sql, (err, result) => {});
}



function Pay(rid, r, a, c, d, t) {
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `INSERT INTO payments (receiver_id, receiver, amount, comment, date, payment_type)
    VALUE ("${rid}", "${r}", "${a}", "${c}", "${d}", "${t}")`
    con.query(sql, (err, result) => {});
  }


module.exports = accounts;

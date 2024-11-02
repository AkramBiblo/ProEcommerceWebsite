const express = require("express");
const sales = express.Router();
const multer = require("multer");
// const upload = multer({ dest: './src/uploadedFiles/' })
const formidable = require("formidable");
// const fs = require("fs");
const path = require("path");
var bodyParser = require("body-parser");
const e = require("express");
const { match } = require("assert");
const { Console } = require("console");
// const { get } = require("./sales");
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

sales.get("/", (req, res) => {
  res.render("sales", {title: "Sales"})
})

sales.post("/search_model", (req, res) => {
  let bc = req.body.barcode;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `SELECT * FROM purchase WHERE barcode = "${bc}" OR model LIKE "%${bc}%" AND status = "Stock"`;
  con.query(sql, (err, result) => {
    if (result.length <= 0) {
      res.send("No product found!");
    } else {
      res.send(result);
    }
  });
});

sales.post("/search_customer", (req, res) => {
  let SI = req.body.customer;
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

sales.post("/get_customer_name", (req, res) => {
  let CID = req.body.CID;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `SELECT * FROM customer WHERE customer_id = "${CID}"`;
  con.query(sql, (err, result) => {
    if (result.length <= 0) {
      res.send("No customer found!");
    } else {
      res.send(result[0]);
    }
  });
});

sales.post("/challan", (req, res) => {
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = "SELECT * FROM sales_challan ORDER BY id DESC LIMIT 30"
    con.query(sql, (err, result) => {
      res.send(result)
    })
  })
})

sales.post("/new", (req, res) => {
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let challanId = req.body.challanId;
  let _data = req.body.data;
  let C_Data = req.body.C_Data;
  let isEdited = req.body.isEdited;
  C_Data = C_Data.split(",")
  let c_balance = 0
  let [CID, C_name, balance] = C_Data;
  let part = _data.slice(0, -1);
  let array = part.split("+,")
  let net_total = 0;
  let _invoice;
  let qty = 0;
  let sales_date;
  for (let i = 0; i < array.length; i++) {
    const e = array[i];
    let a = e.slice(0, -1)
    let productArray = a.split(",")

    let model = productArray[0];
    let barcode = productArray[1];
    sales_date = productArray[2]
    // let challan = productArray[4]
    let color = productArray[3]
    // let prev_stock = productArray[9]
    let sales_rate = productArray[4]
    let mrp = productArray[5]
    let disc_per = productArray[6]
    let flat_disc = productArray[7]
    let invoice = productArray[8]
    _invoice = invoice;
    qty++

    let cal = (Number(mrp) / 100) * Number(disc_per);
    let disc_amt = cal

    let total_sales_rate = Number(sales_rate)
    net_total += total_sales_rate;
    
    
    let sql = `UPDATE purchase SET status = "Sold Out", sale_date = "${sales_date}", sale_invoice_no = "${invoice}", customer_id = "${CID}", sale_value = "${sales_rate}", sale_disc_per = "${disc_per}", sale_flat_disc = "${flat_disc}" WHERE barcode = "${barcode}"`;
          con.query(sql, (err, result) => {})
  }
  
  if (isEdited == "False") {
    c_balance += Number(net_total) + Number(balance)
    let c_sql = `UPDATE customer SET balance = "${c_balance}" WHERE customer_id = "${CID}"`;
    con.query(c_sql, (err, result) => {})
  } else {
     let challanQuery = `SELECT * FROM sales_challan WHERE invoice_no = "${_invoice}"`
     con.query(challanQuery, (err, result) => {
      let deductibleAmount = result[0].sales_value
      let customerQuery = `SELECT * FROM customer WHERE customer_id = "${CID}"`
      con.query(customerQuery, (err, result) => {
        let balance = result[0].balance
        let currentBalance = Number(balance) - Number(deductibleAmount)
        let updatedCurrentBalance = currentBalance + net_total
        let c_sql = `UPDATE customer SET balance = "${updatedCurrentBalance}" WHERE customer_id = "${CID}"`;
        con.query(c_sql, (err, result) => {})
      })
     })
  }

  if (isEdited == "False") {
    let sql = `INSERT INTO sales_challan (sales_date, invoice_no, customer_id, customer_name, sales_value, qty)
    VALUES ("${sales_date}", "${_invoice}", "${CID}", "${C_name}", "${net_total}", "${qty}")`;
   con.query(sql, (err, result) => {
     res.send({ prodUpdateSuccessMsg: "Sales challan updated successfully!!!" })
   })
  } else {
    // let removeChallan = `DELETE FROM sales_challan WHERE invoice_no = "${_invoice}"`
    //     con.query(removeChallan, (err, result) => {
    //       let sql = `INSERT INTO sales_challan (sales_date, invoice_no, customer_id, customer_name, sales_value, qty)
    //        VALUES ("${sales_date}", "${_invoice}", "${CID}", "${C_name}", "${net_total}", "${qty}")`;
    //       con.query(sql, (err, result) => {
    //         res.send({ prodUpdateSuccessMsg: "Sales challan updated successfully!!!" })
    //       })
    //     })
    let updateQuery = `UPDATE sales_challan SET sales_date = "${sales_date}", invoice_no = "${_invoice}", customer_id = "${CID}", customer_name = "${C_name}", sales_value = "${net_total}", qty = "${qty}" WHERE id = "${challanId}"`
    con.query(updateQuery, (err, result) => {
      res.send({ prodUpdateSuccessMsg: "Sales challan updated successfully!!!" })
    })
  }

});

sales.post("/challan/edit", (req, res) => {
  let invoice = req.body.invoice;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM purchase WHERE sale_invoice_no = "${invoice}" AND status = "Sold Out"`
    con.query(sql, (err, result) => {
      res.send(result)
    })
  })
})

sales.post("/remove_invoice", (req, res) => {
  let invoice = req.body.invoice;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {

    let getChallanNetBalance = `SELECT * FROM sales_challan WHERE invoice_no = "${invoice}"`
    con.query(getChallanNetBalance, (err, result) => {
      let netCBalance = result[0].sales_value
      let cid = result[0].customer_id
      let getCBalance = `SELECT * FROM customer WHERE customer_id = "${cid}"`
      con.query(getCBalance, (err, result) => {
        let Cbalance = result[0].balance;
        let updatedBalance = Number(Cbalance) - Number(netCBalance)
        let updateBalance = `UPDATE customer SET balance = "${updatedBalance}" WHERE customer_id = "${cid}"`
        con.query(updateBalance, (err, result) => {
          console.log("Customer balance updated!")
        })
      })
    })

    let removeChallan = `DELETE FROM sales_challan WHERE invoice_no = "${invoice}"`
    con.query(removeChallan, (err, result) => {
      let sql = `UPDATE purchase SET status = "Stock", sale_date = "", sale_invoice_no = "", customer_id = "", sale_value = "", sale_disc_per = "" WHERE sale_invoice_no = "${invoice}"`;
          con.query(sql, (err, result) => {
            let sql = `SELECT * FROM sales_challan`;
              con.query(sql, (err, result) => {
                res.render("sales", {
                  successMsg: "Sales challan removed successfully!",
                  message: result,
                  title: "Sales",
                });
              });
          })

    })
  })
})

sales.post('/getCustomerData', (req, res) => {
  let invoice = req.body.invoice;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM sales_challan WHERE invoice_no = "${invoice}"`
    con.query(sql, (err, result) => {
      let customer_id = result[0].customer_id
      let sql_ = `SELECT * FROM customer WHERE customer_id = "${customer_id}"`
        con.query(sql_, (err, result) => {
          res.send(result[0])
        })
    })
  })
})

sales.post("/return", (req, res) => {
  let barcode = req.body.barcode;
  let returnDate = req.body.returnDate;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
 
  // let sql = `UPDATE purchase SET status = "Returned" WHERE barcode = ${barcode}`;
  let sql_1 = `SELECT * FROM purchase WHERE barcode = "${barcode}"`;
  con.query(sql_1, (err, result) => {
    let bc = result[0].barcode;
    let invoice = result[0].sale_invoice_no;
    let sale_value = result[0].sale_value;
     let sql_2 = `UPDATE purchase SET status = "Stock", sales_return_date = "${returnDate}" WHERE barcode = "${bc}"`;
    con.query(sql_2, (err, result) => {
      let sql_3 = `SELECT * FROM sales_challan WHERE invoice_no = "${invoice}"`;
      con.query(sql_3, (err, result) => {
        let invoice_no = result[0].invoice_no;
        let netTotal = result[0].sales_value;
        let cid = result[0].customer_id;
        let qty = result[0].qty;
        qty = Number(qty) - 1
        updatedSalesValue = Number(netTotal) - Number(sale_value)
        let sql_4 = `UPDATE sales_challan SET sales_value = "${updatedSalesValue}", qty = "${qty}" WHERE invoice_no = "${invoice_no}"`
        con.query(sql_4, (err, result) => {
          let findCustomer = `SELECT * FROM customer WHERE customer_id = "${cid}"`;
          con.query(findCustomer, (err, result) => {
            let balance = result[0].balance;
            balance = Number(balance) - Number(sale_value)
            let updateCustomerBalance = `UPDATE customer SET balance = "${balance}" WHERE customer_id = "${cid}"`
            con.query(updateCustomerBalance, (err, result) => {
              res.send("Product returned successfully!")
            })
          })
        })
      })
    })
  });
})

sales.get("/invoiceVerification/:invoice", (req, res) => {
  let invoice = req.params.invoice;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM sales_challan WHERE invoice_no = "${invoice}"`
    con.query(sql, (err, result) => {
      if (result.length > 0) {
        res.send("Duplicate challan found!")
      }
    })
  })
})

module.exports = sales;

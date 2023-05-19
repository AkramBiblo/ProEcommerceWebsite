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
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM products LIMIT 30`;
    con.query(sql, (err, result) => {
      if (result.length <= 0) {
        res.render("home", {
          message: null,
          title: "Home",
        });
      } else {
        res.render("home", {
          message: result,
          title: "Home",
        });
      }
    });
  });
});
router.get("/gallery", (req, res) => {
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM products ORDER BY Id DESC`;
    con.query(sql, (err, result) => {
      res.render("gallery", {
        message: result,
        title: "Gallery",
      });
    });
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

// router.get('/pcs2022admin', (req, res) => {
//   if (req.cookies.pcs === undefined) {
//     res.render('adminLogin', {title: 'Admin login'})
//   } else {
//     var cmail = req.cookies.pcs;
//     const getDBInfo = require('../../db')
//     const con = getDBInfo.con
//     con.connect(function(err) {
//       var sql = 'SELECT * FROM admin WHERE email = ?';
//       con.query(sql, cmail, function (err, result) {
//         if (result.length <= 0) {
//             res.render('adminLogin', {errorMessage: 'Please input correct email and Password'})
//         } else {
//             res.render('admin', {title: 'Admin'})
//         }

//       });
//     });
//   }

router.get("/#", (req, res) => {
  if (req.cookies.HEAdmin === undefined) {
    res.render("adminLogin", { title: "Admin login" });
  } else {
    var cmail = req.cookies.HEAdmin;
    const getDBInfo = require("../../db");
    const con = getDBInfo.con;
    con.connect(function (err) {
      var sql = "SELECT * FROM admin WHERE email = ?";
      con.query(sql, cmail, function (err, result) {
        if (result.length <= 0) {
          res.render("adminLogin", {
            errorMessage: "Please input correct email and Password",
          });
        } else {
          res.render("admin", { title: "Admin" });
        }
      });
    });
  }

  // res.render('admin', {title: 'Admin login'})
});

router.post("/#", urlencodedParser, function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;

  con.connect(function (err) {
    var sql = "SELECT * FROM admin WHERE login_id = ? AND password = ?";
    con.query(sql, [email, password], function (err, result) {
      if (result.length <= 0) {
        res.render("adminLogin", {
          errorMessage: "Please input correct email and Password",
        });
      } else {
        if (req.cookies.HEAdmin === undefined) {
          let sec = 86400000;
          res.cookie("HEAdmin", `${email}`, { maxAge: sec });
        } else if (req.cookies.pcs !== `${email}`) {
          res.cookie("HEAdmin", `${email}`);
        }
        res.render("admin", { title: "Admin" });
      }
    });
  });
});

router.post("/storeLogin", (req, res) => {
  let ID = req.body.id;
  let pass = req.body.password;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `SELECT * FROM admin WHERE login_id = "${ID}" AND password = "${pass}"`;
  con.query(sql, (err, result) => {
    if (result.length <= 0) {
      res.render("storeLogin", {
        title: "Store Login",
        errorMessage: "Incorrect Login Id or Password!",
      });
    } else {
      if (req.cookies.HEStore === undefined) {
        let sec = 86400000;
        res.cookie("HEStore", `${ID}`, { maxAge: sec });
      } else if (req.cookies.HEStore !== `${ID}`) {
        res.cookie("HEStore", `${ID}`);
      }
      res.render("store", { title: "Store Login" });
    }
  });
});
router.get("/details/:pid", (req, res) => {
  let PID = req.params.pid;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM products WHERE Id = ${PID}`;
    con.query(sql, (err, result) => {
      if (result.length <= 0) {
        res.send({ emptyResult: `Unexpected server error occurred` });
      } else {
        res.render("productDetails", {
          message: result[0],
          title: "Product Details",
        });
      }
    });
  });
});
router.get("/products/all", (req, res) => {
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM products ORDER BY Id DESC`;
    con.query(sql, (err, result) => {
      res.render("allProducts", {
        message: result,
        title: "Products",
      });
    });
  });
});

router.get("/products/allForStore", (req, res) => {
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM products_store ORDER BY Id DESC`;
    con.query(sql, (err, result) => {
      res.render("allProductsForStore", {
        message: result,
        title: "Products",
      });
    });
  });
});

router.get("/orders", (req, res) => {
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT orders.customer_name, orders.order_details, orders.order_time, orders.status, customer.address, customer.phoneNumber
    FROM orders INNER JOIN customer ON orders.customer_name=customer.customer_name`;
    con.query(sql, (err, result) => {
      if (result.length <= 0) {
        res.render("orders", {
          errorMessage: "No orders available.",
          title: "Orders",
        });
      } else {
        let allOrders = [];
        function pushOrderData(data) {
          allOrders.push(data);
        }
        new Promise((resolve) => {
          result.forEach((item) => {
            if (item.status == "Done") {
            } else {
              let arr = [
                item.customer_name,
                item.address,
                item.phoneNumber,
                item.order_time,
              ];
              let a = item.order_details.split("+");
              let orders = [];
              function addOrderToOrdersArray(o) {
                orders.push(o);
              }
              for (let i = 0; i < a.length; i++) {
                const elem = a[i];
                let split = elem.split(",");
                let order = [];
                order.push(split[2]);
                order.push(split[4]);
                addOrderToOrdersArray(order);
              }
              arr.push(orders);
              pushOrderData(arr);
              resolve(arr);
            }
          });
        });
        res.render("orders", { message: allOrders, title: "Orders" });
      }
    });
  });
});

router.post("/soldOutQtyUpdate", (req, res) => {
  let itemName = req.body.itemName;
  let itemQty = req.body.itemQty;
  let CName = req.body.customerName;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let arr = itemName.split(",");
  let arr2 = itemQty.split(",");
  for (let i = 0; i < arr.length; i++) {
    const model = arr[i];
    const qty = arr2[i];

    let sql = `SELECT Qty FROM products WHERE name = "${model}"`;
    con.query(sql, (err, result) => {
      let PrvQty = result[0].Qty;
      let PrsQty = Number(PrvQty) - Number(qty);
      let sql_1 = `UPDATE products SET Qty = ${PrsQty} WHERE name = "${model}"`;
      con.query(sql_1, (err, result) => {});
    });
  }
  let sql = `UPDATE orders SET status = "Done" WHERE customer_name = "${CName}"`;
  con.query(sql, (err, result) => {
    let sql_ = `SELECT orders.customer_name, orders.order_details, orders.order_time, orders.status, customer.address, customer.phoneNumber
    FROM orders INNER JOIN customer ON orders.customer_name=customer.customer_name`;
    con.query(sql_, (err, result) => {
      if (result.length <= 0) {
        res.send(`Name does not match.`);
      } else {
        let allOrders = [];
        function pushOrderData(data) {
          allOrders.push(data);
        }
        new Promise((resolve) => {
          result.forEach((item) => {
            if (item.status == "Done") {
            } else {
              let arr = [
                item.customer_name,
                item.address,
                item.phoneNumber,
                item.order_time,
              ];
              let a = item.order_details.split("+");
              let orders = [];
              function addOrderToOrdersArray(o) {
                orders.push(o);
              }
              for (let i = 0; i < a.length; i++) {
                const elem = a[i];
                let split = elem.split(",");
                let order = [];
                order.push(split[2]);
                order.push(split[4]);
                addOrderToOrdersArray(order);
              }
              arr.push(orders);
              pushOrderData(arr);
              resolve(arr);
            }
          });
        });
        res.render("orders", { message: allOrders, title: "Orders" });
      }
    });
  });
});

router.get("/checkout", (req, res) => {
  res.render("checkout");
});

router.get("/mycart", (req, res) => {
  // if(req.cookies.cartData != undefined){
  //   let c = req.cookies.cartData;
  //   let ca = c.split('+');
  //   let data = [];

  //    for (let i = 0; i < ca.length; i++) {
  //      const e = ca[i];
  //     let arr = e.split(',')
  //     let product =  [PID, Title, Model, Brand, Qty, UnitPrice, TotalPrice] = [arr[0], arr[1], arr[2], arr[3], arr[4], arr[5], arr[6]]
  //     // let product = [PID, Title, Model, Brand, Qty, UnitPrice, TotalPrice]
  //     data.push(product)
  //   }
  //   res.render('mycart', {Title: 'My cart', cartData: data})
  // }

  res.render("mycart", { Title: "My cart" });
});

router.post("/billingInfo", (req, res) => {
  let FullName = req.body.FullName;
  let Address = req.body.Address;
  let City = req.body.City;
  let Division = req.body.Division;
  let PostCode = req.body.PostCode;
  let Email = req.body.Email;
  let phoneNumber = req.body.phoneNumber;
  let c = req.cookies.cartData;
  // let order_details = c.split('+');

  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql_1 = `INSERT INTO orders (customer_name, order_details)
        VALUES ("${FullName}", "${c}")`;
    con.query(sql_1, (err, result) => {});
  });
  con.connect((err) => {
    let sql_2 = `INSERT INTO customer (customer_name, address, city, division, postCode, email, phoneNumber)
        VALUES ("${FullName}", "${Address}", "${City}", "${Division}", ${PostCode}, "${Email}", "${phoneNumber}")`;
    con.query(sql_2, (err, result) => {
      // Lead to SSLCommarz payment intigration
      res.clearCookie("cartData");
      res.render("success", { title: "Order Successful" });
    });
  });
});

router.post("/edit", (req, res) => {
  let PID = req.body.pid;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM products WHERE Id = ${PID}`;
    con.query(sql, (err, result) => {
      if (result.length <= 0) {
        res.send({ emptyResult: `Unexpected server error occurred` });
      } else {
        res.render("editProduct", {
          message: result[0],
          title: "Edit Product",
        });
      }
    });
  });
});

router.post("/updateMRP", (req, res) => {
  let id = req.body.id;
  let MRP = req.body.mrp;
  let DMRP = req.body.dmrp;

  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let query = `SELECT * FROM products WHERE Id = ${id}`;
    con.query(query, (err, result) => {
      if (result.length <= 0) {
        res.send(`<div class="container">
        <div class="alert alert-danger">
            Product code not found!
          </div>
        </div>`);
      } else {
        let sql = `UPDATE products SET mrp = ${MRP}, demo_MRP = ${DMRP} WHERE Id = ${id}`;
        con.query(sql, (err, result) => {
          res.send(` <div class="container">
        <div class="alert alert-success">
            MRP Updated successfully!
          </div>
        </div>`);
        });
      }
    });
  });
});

router.post("/updateQty", (req, res) => {
  let id = req.body.Id;
  let Model = req.body.Model;
  let Qty = req.body.Qty;

  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let query = `SELECT * FROM products WHERE Id = ${id} AND name LIKE "%${Model}%"`;
    con.query(query, (err, result) => {
      if (result.length <= 0) {
        res.send(`<div class="container">
        <div class="alert alert-danger">
            Product Model & Code does not match!
          </div>
        </div>`);
      } else {
        let sql = `SELECT * FROM products WHERE Id = ${id}`;
        con.query(sql, (err, result) => {
          if (result.length >= 0) {
            let Q = result[0].Qty;
            let totalQty = Number(Qty) + Number(Q);
            let sql = `UPDATE products SET Qty = ${totalQty} WHERE Id = ${id}`;
            con.query(sql, (err, result) => {
              res.send(` <div class="container">
                <div class="alert alert-success">
                    Product Quantity Updated successfully!
                  </div>
                </div>`);
            });
          }
        });
      }
    });
  });
});

router.post("/updateQtyFromAP", (req, res) => {
  let id = req.body.Id;
  let Qty = req.body.Qty;

  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM products WHERE Id = ${id}`;
    con.query(sql, (err, result) => {
      if (result.length >= 0) {
        let Q = result[0].Qty;
        let totalQty = Number(Qty) + Number(Q);
        let sql = `UPDATE products SET Qty = ${totalQty} WHERE Id = ${id}`;
        con.query(sql, (err, result) => {
          let sql = `SELECT * FROM products ORDER BY Id DESC`;
          con.query(sql, (err, result) => {
            res.render("allProducts", {
              message: result,
              title: "Products",
              successMsg: "Quantity Updated Successfully!",
            });
          });
        });
      }
    });
  });
});

router.post("/updateQtyFromStore", (req, res) => {
  let id = req.body.Id;
  let Qty = req.body.Qty;

  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM products_store WHERE Id = ${id}`;
    con.query(sql, (err, result) => {
      if (result.length >= 0) {
        let Q = result[0].Qty;
        let totalQty = Number(Qty) + Number(Q);
        let sql = `UPDATE products_store SET Qty = ${totalQty} WHERE Id = ${id}`;
        con.query(sql, (err, result) => {
          let sql = `SELECT * FROM products_store ORDER BY Id DESC`;
          con.query(sql, (err, result) => {
            res.render("allProductsForStore", {
              message: result,
              title: "Products",
              successMsg: "Quantity Updated Successfully!",
            });
          });
        });
      }
    });
  });
});

router.post("/soldOutQtyUpdateForStore", (req, res) => {
  let id = req.body.Id;
  let Qty = req.body.Qty;

  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM products_store WHERE Id = ${id}`;
    con.query(sql, (err, result) => {
      if (result.length >= 0) {
        let Q = result[0].Qty;
        if (Number(Q) < Number(Qty)) {
          let sql = `SELECT * FROM products_store WHERE Id = ${id}`;
          con.query(sql, (err, result) => {
            res.render("allProductsForStore", {
              message: result,
              title: "Products",
              errorMessage: "Insufficient Quantity!",
            });
          });
        } else {
          let totalQty = Number(Q) - Number(Qty);
          let sql = `UPDATE products_store SET Qty = ${totalQty} WHERE Id = ${id}`;
          con.query(sql, (err, result) => {
            let sql = `SELECT * FROM products_store ORDER BY Id DESC`;
            con.query(sql, (err, result) => {
              res.render("allProductsForStore", {
                message: result,
                title: "Products",
                successMsg: "Quantity Updated Successfully!",
              });
            });
          });
        }
      }
    });
  });
});

router.post("/edit/update/:pid", (req, res) => {
  let PID = req.params.pid;
  let Title = req.body.Title;
  let KeyWords = req.body.KeyWords;
  let Brand = req.body.Brand;
  let Type = req.body.Type;
  let Category = req.body.Category;
  let Color = req.body.Color;
  let Barcode = req.body.Barcode;
  let MRP = req.body.MRP;
  let Description = req.body.Description;
  let DMRP = req.body.demo_MRP;
  let Qty = req.body.Qty;

  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `UPDATE products SET name = "${Title}", brand = "${Brand}", type = "${Type}", demo_MRP = ${DMRP}, Qty = ${Qty}, 
    color = "${Color}", category = "${Category}", barcode = "${Barcode}", MRP = ${MRP}, description = "${Description}", keyWords = "${KeyWords}" WHERE Id = ${PID}`;
    con.query(sql, (err, result) => {
      res.render("forms", { successMsg: "Product updated seccessfully!!!" });
    });
  });
});

router.post("/search", (req, res) => {
  let si = req.body.search_input;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM products WHERE name LIKE "%${si}%" OR brand LIKE "%${si}%" OR type LIKE "%${si}%" OR KeyWords LIKE "%${si}%" OR category LIKE "%${si}%"`;
    con.query(sql, (err, result) => {
      if (result.length <= 0) {
        res.render("search", {
          errorMessage: `Sorry! products not found. Try with proper name or brand.`,
        });
        // res.send({emptyResult:`Sorry no product found with the name of <strong>${si}</strong>! Kindly search by product name or brand.`})
      } else {
        res.render("search", { message: result });
      }
    });
  });
});

router.get("/search/:category", (req, res) => {
  let Brand = req.params.brand;
  let category = req.params.category;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM products WHERE category LIKE "%${category}%"`;
    con.query(sql, (err, result) => {
      if (result.length <= 0) {
        res.render("search", {
          errorMessage: `Sorry! This brand's products are not available right now. Try another brand.`,
        });
      } else {
        res.render("search", { message: result });
      }
    });
  });
});

router.get("/search/all/:category", (req, res) => {
  let category = req.params.category;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM products WHERE type LIKE "%${category}%"`;
    con.query(sql, (err, result) => {
      if (result.length <= 0) {
        res.render("search", {
          errorMessage: `Sorry! This brand's products are not available right now. Try another brand.`,
        });
      } else {
        res.render("search", { message: result });
      }
    });
  });
});

router.post("/search/filterbybrand/:brand", (req, res) => {
  let Brand = req.params.brand;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM products WHERE Brand LIKE "%${Brand}%"`;
    con.query(sql, (err, result) => {
      if (result.length <= 0) {
        res.send(
          `Sorry! ${Brand}'s products are not available right now. Try another brand.`
        );
      } else {
        // res.send(result)

        let htmlCode = [];
        for (const product of result) {
          htmlCode.push(`
          <div class="gallery border p-2 m-1" style="width:270px;">
            <div class="container-fluid text-center">
                <h5>${product.name}</h5>
            </div>
            <div class="p-2">
                <a href="/details/${product.Id}">
                    <img src="/uploadedFiles/${product.File_1}" class="img-fluid rounded" style="max-width: 200px;max-height: 200px;" alt="Product Image">
                </a>
            </div>
            <div class="col p-2">
                <p><strong>Brand :</strong>${product.brand}</p>
                <p><strong>Model :</strong>${product.model}</p>
                <p><strong>Description :</strong>${product.description}</p>
                <p><strong>Product Code :</strong>${product.Id}</p>
                <p><strong>Price (BDT) :</strong>${product.mrp}</p>
                <div id="${product.Id}">
                  <input type="hidden" name="productid" value="${product.Id}">
                  <input type="hidden" name="productTitle" value="${product.name}">
                  <input type="hidden" name="model" value="${product.model}">
                  <input type="hidden" name="brand" value="${product.brand}">
                  <input type="hidden" name="price" value="${product.mrp}">
                </div>
                <button name="addToCart" productid="${product.Id}" brand="${product.brand}" productTitle="${product.name}" model="${product.model}" price="${product.mrp}" class="btn btn-outline-dark btn-sm addToCart">
                    <span class="fab fa-opencart"></span> Add to cart
                </button>
            </div>
        </div>
            `);
        }
        res.send(htmlCode);
      }
    });
  });
});

router.post("/search_store/filterbybrand", (req, res) => {
  let brand = req.body.brand;
  let type = req.body.type;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM products_store WHERE Brand LIKE "%${brand}%" AND type LIKE "%${type}%"`;
    con.query(sql, (err, result) => {
      if (result.length <= 0) {
        res.send(
          `Sorry! ${brand}'s products are not available right now. Try another brand.`
        );
      } else {
        // res.send(result)

        let htmlCode = [];
        for (const product of result) {
          htmlCode.push(`<tr>
          <td>${product.name}</td>
          <td>${product.type}</td>
          <td>${product.brand}</td>
          <td>${product.Qty}</td>
          <td>
            <form action="/updateQtyFromStore" method="POST">
              <input type="hidden" name="Id" value="${product.Id}" />
              <input type="hidden" name="Model" value="${product.name}" />
              <input type="text" name="Qty" style="width: 50px" required/>
              <button type="submit" class="btn btn-outline-dark">Add</button>
            </form>
          </td>
          <td>
            <form action="/soldOutQtyUpdateForStore" method="POST">
              <input type="hidden" name="Id" value="${product.Id}" />
              <input type="hidden" name="Model" value="${product.name}" />
              <input type="text" name="Qty" style="width: 50px" required/>
              <button type="submit" class="btn btn-outline-dark">
                Sold Out
              </button>
            </form>
          </td>
        </tr>
            `);
        }
        res.send(htmlCode);
      }
    });
  });
});

router.post("/search_store/filterbybrand/:brand", (req, res) => {
  let brand = req.params.brand;

  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM products_store WHERE Brand LIKE "%${brand}%"`;
    con.query(sql, (err, result) => {
      if (result.length <= 0) {
        res.send(
          `Sorry! ${brand}'s products are not available right now. Try another brand.`
        );
      } else {
        // res.send(result)

        let htmlCode = [];
        for (const product of result) {
          htmlCode.push(`<tr>
          <td>${product.name}</td>
          <td>${product.type}</td>
          <td>${product.brand}</td>
          <td>${product.Qty}</td>
          <td>
            <form action="/updateQtyFromStore" method="POST">
              <input type="hidden" name="Id" value="${product.Id}" />
              <input type="hidden" name="Model" value="${product.name}" />
              <input type="text" name="Qty" style="width: 50px" required/>
              <button type="submit" class="btn btn-outline-dark">Add</button>
            </form>
          </td>
          <td>
            <form action="/soldOutQtyUpdateForStore" method="POST">
              <input type="hidden" name="Id" value="${product.Id}" />
              <input type="hidden" name="Model" value="${product.name}" />
              <input type="text" name="Qty" style="width: 50px" required/>
              <button type="submit" class="btn btn-outline-dark">
                Sold Out
              </button>
            </form>
          </td>
        </tr>
            `);
        }
        res.send(htmlCode);
      }
    });
  });
});

router.post("/search/fromAdminAllProducts", (req, res) => {
  let si = req.body.brand;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM products WHERE name LIKE "%${si}%" OR brand LIKE "%${si}%" OR type LIKE "%${si}%" OR KeyWords LIKE "%${si}%" OR category LIKE "%${si}%"`;
    con.query(sql, (err, result) => {
      if (result.length <= 0) {
        res.send(`Name does not match.`);
      } else {
        // res.send(result)

        let htmlCode = [];
        for (const item of result) {
          let v = Number(item.Qty * item.mrp);
          htmlCode.push(`<tr>
            <td><img style="border-radius: 8px; max-height: 70px;max-width: 70px;" src="/uploadedFiles/${item.File_1}" alt="Image"></td>
            <td>${item.Id}</td>
            <td>${item.name}</td>
            <td>${item.type}</td>
            <td>${item.brand}</td>
            <td>${item.Qty}</td>
            <td>
                    <form action="/updateQtyFromAP" method="POST">
                      <input type="hidden" name="Id" value="${item.Id}">
                      <input type="hidden" name="Model" value="${item.name}">
                      <input type="text" name="Qty">
                        <button type="submit" class="btn btn-outline-light">Add</button>
                      </form>  
            </td>
            <td>${item.mrp}</td>
            <td>${v}</td>
        </tr>
            `);
        }
        res.send(htmlCode);
      }
    });
  });
});

router.post("/search/fromStoreAllProducts", (req, res) => {
  let si = req.body.brand;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM products_store WHERE name LIKE "%${si}%" OR brand LIKE "%${si}%" OR type LIKE "%${si}%"`;
    con.query(sql, (err, result) => {
      if (result.length <= 0) {
        res.send(`Name does not match.`);
      } else {
        // res.send(result)

        let htmlCode = [];
        for (const item of result) {
          htmlCode.push(`<tr>
            <td>${item.Id}</td>
            <td>${item.name}</td>
            <td>${item.type}</td>
            <td>${item.brand}</td>
            <td>${item.Qty}</td>
            <td>
              <form action="/updateQtyFromStore" method="POST">
                <input type="hidden" name="Id" value="${item.Id}">
                <input type="hidden" name="Model" value="${item.name}">
                <input type="text" name="Qty" style="width: 50px;">
                  <button type="submit" class="btn btn-outline-light">Add</button>
                </form>  
            </td>
            <td>
              <form action="/soldOutQtyUpdateForStore" method="POST">
              <input type="hidden" name="Id" value="${item.Id}">
              <input type="hidden" name="Model" value="${item.name}">
                <input type="text" name="Qty" style="width: 50px;">
                  <button type="submit" class="btn btn-outline-light">Sold Out</button>
                </form>  
            </td>
        </tr>`);
        }
        res.send(htmlCode);
      }
    });
  });
});

router.post("/search/fromAdminAllProductsForCustomer", (req, res) => {
  let si = req.body.brand;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM products WHERE name LIKE "%${si}%" OR brand LIKE "%${si}%" OR type LIKE "%${si}%" OR KeyWords LIKE "%${si}%" OR category LIKE "%${si}%"`;
    con.query(sql, (err, result) => {
      if (result.length <= 0) {
        res.send(`Name does not match.`);
      } else {
        // res.send(result)

        let htmlCode = [];
        for (const item of result) {
          htmlCode.push(`<tr>
            <td><img style="border-radius: 8px; max-height: 70px;max-width: 70px;" src="/uploadedFiles/${item.File_1}" alt="Image"></td>
            <td>${item.Id}</td>
            <td>${item.name}</td>
            <td>${item.type}</td>
            <td>${item.brand}</td>
            <td>${item.mrp}</td>
            <td><button type="button" name="addToCart" productid="${item.Id}" brand="${item.brand}" productTitle="${item.type}" model="${item.name}" price="${item.mrp}" class="btn btn-outline-light btn-sm addToCart">
                            <span class="fab fa-opencart"></span> Add to cart
                          </button></td>
                      </tr>
        </tr>
            `);
        }
        res.send(htmlCode);
      }
    });
  });
});

// router.post('/addToCart', (req, res) => {
//   let PID = req.body.productid
//   let PT = req.body.productTitle
//   let model = req.body.model
//   let brand = req.body.brand
//   let price = req.body.price
//   let data = [PID,PT,model,brand,price]
//   if (req.cookies.cartData == undefined) {
//     res.cookie(`cartData=${data};path=/;`)
//     res.send('Product added to your cart successfully! <a href="/">Go back</a>')
//   } else {

//     let c = req.cookies.cartData;
//     let ca = c.split('+');
//      for (let i = 0; i < ca.length; i++) {
//        const e = ca[i];
//       let arr = e.split(',')
//       if (arr[0] == PID) {
//           return res.send('This item already added to your cart! <a href="/">Go back</a>')
//         }
//       }
//     res.cookie(`cartData=${c + '+' + data};path=/;`);
//     res.send('Product added to your cart successfully! <a href="/">Go back</a>')
//   }
// })

router.get("/search/:accessories/:title", (req, res) => {
  let title = req.params.title;
  let accessories = req.params.accessories;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM products WHERE Type LIKE "%${accessories}%" AND KeyWords LIKE "%${title}%"`;
    con.query(sql, (err, result) => {
      if (result.length <= 0) {
        res.render("search", {
          errorMessage: `Sorry! This products are not available right now. Try another brand.`,
        });
      } else {
        res.render("search", { message: result });
      }
    });
  });
});

router.post("/search/filterbypricerange", (req, res) => {
  let title = req.body.title;
  let rangeFrom = req.body.rangeFrom;
  let rangeTo = req.body.rangeTo;
  Number(rangeFrom);
  Number(rangeTo);
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM products WHERE keywords LIKE "%${title}%" AND mrp >= ${rangeFrom} AND mrp <= ${rangeTo}`;
    con.query(sql, (err, result) => {
      if (result.length <= 0) {
        res.render("search", {
          errorMessage: `Sorry! No products available within this price range. Kindly increase price range.`,
        });
      } else {
        res.render("search", { message: result });
      }
    });
  });
});

module.exports = router;

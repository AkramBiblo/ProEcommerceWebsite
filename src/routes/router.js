const express = require("express");
const router = express.Router();
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const { resolve } = require("path");
const e = require("express");
router.use(cookieParser());
// create application/json parser
var jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: true });

router.get("/", (req, res) => {
//   const getDBInfo = require("../../db");
//   const con = getDBInfo.con;
//   con.connect(() => {
//     let sql = `CREATE TABLE supplier AS SELECT * FROM customer;`;
//     con.query(sql, () => {console.log('Table created')})
// })
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

router.get("/color", (req, res) => {
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `SELECT * FROM basic_module WHERE module = "color"`;
  con.query(sql, (err, result) => {
    res.render("basic_color", {
      message: result,
      title: "Color",
    });
  });
});

router.get("/brand", (req, res) => {
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `SELECT * FROM basic_module WHERE module = "brand"`;
  con.query(sql, (err, result) => {
    res.render("basic_brand", {
      message: result,
      title: "Brand",
    });
  });
});

router.get("/godown", (req, res) => {
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `SELECT * FROM basic_module WHERE module = "godown"`;
  con.query(sql, (err, result) => {
    res.render("basic_godown", {
      message: result,
      title: "Godown",
    });
  });
});

router.get("/products", (req, res) => {
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `SELECT * FROM basic_module`;
  con.query(sql, (err, result) => {
    let company = [];
    let category = [];
    result.forEach(e => {
      if (e.module == "company") {
        company.push(e.name)
      } else if (e.module == "category") {
        category.push(e.name)
      }
    });
    let sql = `SELECT * FROM basic_products`;
    con.query(sql, (err, result) => {
      res.render("basic_products", {
        message: result,
        company: company,
        category: category,
        title: "Products",
      });
    });
  });
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
  let ob = req.body.ob;
  
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  spl_query = `SELECT * FROM basic_module WHERE name = "${name}"`;
  con.query(spl_query, (err, result) => {
    if (result.length <= 0) {
      let sql = `INSERT INTO basic_module (module, name, address, mobile, balance) VALUES ("company", "${name}", "${address}", "${mobile}", ${ob})`;
      con.query(sql, (err, result) => {
        let sql = `SELECT * FROM basic_module WHERE module = "company"`;
        con.query(sql, (err, result) => {
          res.render("basic_companies", {
            successMsg: "New company added successfully!",
            message: result,
            title: "Companies",
          });
        });
      });
      
    } else {
      let sql = `SELECT * FROM basic_module WHERE module = "company"`;
      con.query(sql, (err, result) => {
        res.render("basic_companies", {
          errorMessage: "This company is already exist!",
          message: result,
          title: "Companies",
        });
      });
    }
  })
  
  
});

router.post("/basic_new_product_upload", (req, res) => {
  let name = req.body.name;
  let category = req.body.category;
  let brand = req.body.brand;
  let mrp = req.body.mrp;

  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql_query = `SELECT * FROM basic_products WHERE product_name = "${name}"`;
  con.query(sql_query, (err, result) => {
    if (result.length <= 0) {
      let sql = `INSERT INTO basic_products (product_name, category, brand, mrp) VALUES ("${name}", "${category}", "${brand}", "${mrp}")`;
      con.query(sql, (err, result) => {
        let sql = `SELECT * FROM basic_module`;
        con.query(sql, (err, result) => {
          let company = [];
          let category = [];
          result.forEach((e) => {
            if (e.module == "company") {
              company.push(e.name);
            } else if (e.module == "category") {
              category.push(e.name);
            }
          });
          let sql = `SELECT * FROM basic_products`;
          con.query(sql, (err, result) => {
            res.render("basic_products", {
              successMsg: "New product uploaded successfully!",
              message: result,
              company: company,
              category: category,
              title: "Products",
            });
          });
        });
      });
    } else {
       let sql = `SELECT * FROM basic_module`;
       con.query(sql, (err, result) => {
         let company = [];
         let category = [];
         result.forEach((e) => {
           if (e.module == "company") {
             company.push(e.name);
           } else if (e.module == "category") {
             category.push(e.name);
           }
         });
         let sql = `SELECT * FROM basic_products`;
         con.query(sql, (err, result) => {
           res.render("basic_products", {
             errorMessage: "This product is already exist!",
             message: result,
             company: company,
             category: category,
             title: "Products",
           });
         });
       });
    }
  });

  
});

router.post("/basic_new_category_upload", (req, res) => {
  let name = req.body.name;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql_query = `SELECT * FROM basic_module WHERE name = "${name}"`;
  con.query(sql_query, (err, result) => {
    if (result.length <= 0) {
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
      });
    } else {
      let sql = `SELECT * FROM basic_module WHERE module = "category"`;
      con.query(sql, (err, result) => {
        res.render("basic_categories", {
          errorMessage: "This category is already exist!",
          message: result,
          title: "Categories",
        });
      });
    }
  })

  
});

router.post("/basic_new_color_upload", (req, res) => {
  let name = req.body.name;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;

  let sql_query = `SELECT * FROM basic_module WHERE name = "${name}"`;
  con.query(sql_query, (err, result) => {
    if (result.length <= 0) {
      let sql = `INSERT INTO basic_module (module, name) VALUES ("color", "${name}")`;
      con.query(sql, (err, result) => {
        let sql = `SELECT * FROM basic_module WHERE module = "color"`;
        con.query(sql, (err, result) => {
          res.render("basic_color", {
            successMsg: "New color added successfully!",
            message: result,
            title: "Color",
          });
        });
      });
    } else {
       let sql = `SELECT * FROM basic_module WHERE module = "color"`;
       con.query(sql, (err, result) => {
         res.render("basic_color", {
           errorMessage: "This color is already exist!",
           message: result,
           title: "Color",
         });
       });
    }
  });
 
});

router.post("/basic_new_brand_upload", (req, res) => {
  let name = req.body.name;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;

  let sql_query = `SELECT * FROM basic_module WHERE name = "${name}"`;
  con.query(sql_query, (err, result) => {
    if (result.length <= 0) {
      let sql = `INSERT INTO basic_module (module, name) VALUES ("brand", "${name}")`;
      con.query(sql, (err, result) => {
        let sql = `SELECT * FROM basic_module WHERE module = "brand"`;
        con.query(sql, (err, result) => {
          res.render("basic_brand", {
            successMsg: "New brand added successfully!",
            message: result,
            title: "Brand",
          });
        });
      });
    } else {
       let sql = `SELECT * FROM basic_module WHERE module = "brand"`;
       con.query(sql, (err, result) => {
         res.render("basic_brand", {
           errorMessage: "This brand is already exist!",
           message: result,
           title: "Brand",
         });
       });
    }
  });
 
});

router.post("/basic_new_godown_upload", (req, res) => {
  let name = req.body.name;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;

  let sql_query = `SELECT * FROM basic_module WHERE name = "${name}"`;
  con.query(sql_query, (err, result) => {
    if (result.length <= 0) {
      let sql = `INSERT INTO basic_module (module, name) VALUES ("godown", "${name}")`;
      con.query(sql, (err, result) => {
        let sql = `SELECT * FROM basic_module WHERE module = "godown"`;
        con.query(sql, (err, result) => {
          res.render("basic_godown", {
            successMsg: "New Godown added successfully!",
            message: result,
            title: "Godown",
          });
        });
      });
    } else {
      let sql = `SELECT * FROM basic_module WHERE module = "godown"`;
      con.query(sql, (err, result) => {
        res.render("basic_godown", {
          errorMessage: "This godown is already exist!",
          message: result,
          title: "godown",
        });
      });
    }
  });
});

router.post("/basic_company_delete", (req, res) => {
  let cid = req.body.cid;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `DELETE FROM basic_module WHERE id = "${cid}"`;
  con.query(sql, (err, result) => {
    let sql = `SELECT * FROM basic_module WHERE module = "company"`;
    con.query(sql, (err, result) => {
      res.render("basic_companies", {
        successMsg: "Company removed successfully!",
        message: result,
        title: "Companies",
      });
    });
  });
});

router.post("/basic_product_delete", (req, res) => {
  let cid = req.body.cid;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `DELETE FROM basic_products WHERE id = "${cid}"`;
  con.query(sql, (err, result) => {
    let sql = `SELECT * FROM basic_module`;
    con.query(sql, (err, result) => {
      let company = [];
      let category = [];
      result.forEach((e) => {
        if (e.module == "company") {
          company.push(e.name);
        } else if (e.module == "category") {
          category.push(e.name);
        }
      });
      let sql = `SELECT * FROM basic_products`;
      con.query(sql, (err, result) => {
        res.render("basic_products", {
          successMsg: "Product removed successfully!",
          message: result,
          company: company,
          category: category,
          title: "Products",
        });
      });
    });
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
  });
});

router.post("/basic_color_delete", (req, res) => {
  let cid = req.body.cid;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `DELETE FROM basic_module WHERE id = "${cid}"`;
  con.query(sql, (err, result) => {
    let sql = `SELECT * FROM basic_module WHERE module = "color"`;
    con.query(sql, (err, result) => {
      res.render("basic_color", {
        successMsg: "Color removed successfully!",
        message: result,
        title: "Color",
      });
    });
  });
});

router.post("/basic_brand_delete", (req, res) => {
  let bid = req.body.bid;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `DELETE FROM basic_module WHERE id = "${bid}"`;
  con.query(sql, (err, result) => {
    let sql = `SELECT * FROM basic_module WHERE module = "brand"`;
    con.query(sql, (err, result) => {
      res.render("basic_brand", {
        successMsg: "Brand removed successfully!",
        message: result,
        title: "Brand",
      });
    });
  });
});

router.post("/basic_godown_delete", (req, res) => {
  let cid = req.body.cid;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `DELETE FROM basic_module WHERE id = "${cid}"`;
  con.query(sql, (err, result) => {
    let sql = `SELECT * FROM basic_module WHERE module = "godown"`;
    con.query(sql, (err, result) => {
      res.render("basic_godown", {
        successMsg: "godown removed successfully!",
        message: result,
        title: "Godown",
      });
    });
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

router.post("/basic_product_edit", (req, res) => {
  let cid = req.body.cid;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `SELECT * FROM basic_products WHERE id = "${cid}"`;
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

router.post("/basic_color_edit", (req, res) => {
  let cid = req.body.cid;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `SELECT * FROM basic_module WHERE id = "${cid}"`;
  con.query(sql, (err, result) => {
    res.send(result[0]);
  });
});

router.post("/basic_brand_edit", (req, res) => {
  let bid = req.body.bid;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `SELECT * FROM basic_module WHERE id = "${bid}"`;
  con.query(sql, (err, result) => {
    res.send(result[0]);
  });
});

router.post("/basic_godown_edit", (req, res) => {
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
    let sql = `SELECT * FROM basic_module WHERE module = "company"`;
    con.query(sql, (err, result) => {
      res.render("basic_companies", {
        successMsg: "Company updated successfully!",
        message: result,
        title: "Companies",
      });
    });
  });

});

router.post("/basic_edit_product_update", (req, res) => {
  let cid = req.body.cid;
  let name = req.body.name;
  let category = req.body.category;
  let brand = req.body.brand;
  let mrp = req.body.mrp;
  console.log(cid)
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `UPDATE basic_products SET product_name = "${name}", category = "${category}", brand = "${brand}", mrp = "${mrp}" WHERE id = "${cid}"`;
  con.query(sql, (err, result) => {
    let sql = `SELECT * FROM basic_module`;
    con.query(sql, (err, result) => {
      let company = [];
      let category = [];
      result.forEach((e) => {
        if (e.module == "company") {
          company.push(e.name);
        } else if (e.module == "category") {
          category.push(e.name);
        }
      });
      let sql = `SELECT * FROM basic_products`;
      con.query(sql, (err, result) => {
        res.render("basic_products", {
          successMsg: "Product updated successfully!",
          message: result,
          company: company,
          category: category,
          title: "Products",
        });
      });
    });
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

router.post("/basic_edit_color_update", (req, res) => {
  let cid = req.body.cid;
  let name = req.body.name;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `UPDATE basic_module SET name = "${name}" WHERE id = "${cid}"`;
  con.query(sql, (err, result) => {
    let sql = `SELECT * FROM basic_module WHERE module = "color"`;
    con.query(sql, (err, result) => {
      res.render("basic_color", {
        successMsg: "Color updated successfully!",
        message: result,
        title: "Color",
      });
    });
  });
});

router.post("/basic_edit_brand_update", (req, res) => {
  let bid = req.body.bid;
  let name = req.body.name;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `UPDATE basic_module SET name = "${name}" WHERE id = "${bid}"`;
  con.query(sql, (err, result) => {
    let sql = `SELECT * FROM basic_module WHERE module = "brand"`;
    con.query(sql, (err, result) => {
      res.render("basic_brand", {
        successMsg: "Brand updated successfully!",
        message: result,
        title: "Brand",
      });
    });
  });
});

router.post("/basic_edit_godown_update", (req, res) => {
  let cid = req.body.cid;
  let name = req.body.name;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `UPDATE basic_module SET name = "${name}" WHERE id = "${cid}"`;
  con.query(sql, (err, result) => {
    let sql = `SELECT * FROM basic_module WHERE module = "godown"`;
    con.query(sql, (err, result) => {
      res.render("basic_godown", {
        successMsg: "Godown updated successfully!",
        message: result,
        title: "Godown",
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
      res.send("No company found!");
    } else {
      res.send(result);
    }
  });
});

router.post("/basic_product_search", (req, res) => {
  let SI = req.body.SI;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `SELECT * FROM basic_products WHERE product_name LIKE "%${SI}%"`;
  con.query(sql, (err, result) => {
    if (result.length <= 0) {
      res.send("No product found!");
    } else {
      res.send(result);
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
      res.send("No category found!");
    } else {
      res.send(result);
    }
  });
});

router.post("/basic_color_search", (req, res) => {
  let SI = req.body.SI;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `SELECT * FROM basic_module WHERE name LIKE "%${SI}%"`;
  con.query(sql, (err, result) => {
    if (result.length <= 0) {
      res.send("No color found!");
    } else {
      res.send(result);
    }
  });
});

router.post("/basic_brand_search", (req, res) => {
  let SI = req.body.SI;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `SELECT * FROM basic_module WHERE name LIKE "%${SI}%"`;
  con.query(sql, (err, result) => {
    if (result.length <= 0) {
      res.send("No brand found!");
    } else {
      res.send(result);
    }
  });
});

router.post("/basic_godown_search", (req, res) => {
  let SI = req.body.SI;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `SELECT * FROM basic_module WHERE name LIKE "%${SI}%"`;
  con.query(sql, (err, result) => {
    if (result.length <= 0) {
      res.send("No Godown found!");
    } else {
      res.send(result);
    }
  });
});


module.exports = router;

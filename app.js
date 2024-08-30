const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const PORT = process.env.PORT || 2000;

const router = require("./src/routes/router");
const bankbook = require("./src/routes/bankbook");
const register = require("./src/routes/employee");
const customer = require("./src/routes/customer");
const supplier = require("./src/routes/supplier");
const accounts = require("./src/routes/accounts");
const purchase = require("./src/routes/purchase");
const sales = require("./src/routes/sales");

// Templating Engine
app.set("views", "./src/views");
app.set("view engine", "ejs");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(bodyParser.urlencoded({ limit: "2mb", extended: false }));

// Static files
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/img", express.static(__dirname + "public/img"));
app.use("/js", express.static(__dirname + "public/js"));
app.use("/uploadedFiles", express.static(__dirname + "public/uploadedFiles"));

// Routes
app.use("/", router);
app.use("/bank", bankbook);
app.use("/employee", register);
app.use("/customer", customer);
app.use("/supplier", supplier);
app.use("/accounts", accounts);
app.use("/purchase", purchase);
app.use("/sales", sales);

app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log(`Server is listening on port ${PORT}`);
});

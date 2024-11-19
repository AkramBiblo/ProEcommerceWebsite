var mysql = require("mysql");
let con = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
})

function connectToDatabase(database) {
  var mysql = require("mysql");
  let con = mysql.createConnection({
    host: "localhost", // Get with the email
    user: "root",
    password: "",
    database: `${database}`,
  });
  return con
}

function getDataFrom(db, arr) {
  let data = [];
  var mysql = require("mysql");
  let con = mysql.createConnection({
    host: "localhost", // Get with the email
    user: "root",
    password: "",
    database: `${db}`,
  });
  
  con.connect((err) => {
    for (let i = 0; i < arr.length; i++) {
      const tableName = arr[i];
      let sql = `SELECT * FROM ${tableName}`
      con.query(sql, (err, result) => {
        data.push(result)
      })
    }
  })
  return data
}

function getDataFromDB(db, arr) {
  let data = [];
  var mysql = require("mysql");
  let con = mysql.createConnection({
    host: "localhost", // Get with the email
    user: "root",
    password: "",
    database: `${db}`,
  });
  
  con.connect((err) => {
    
    for (let i = 0; i < arr.length; i++) {
      const QueryData = arr[i];
      let QTable = QueryData.table
      let QueryArr = QueryData.Query
      let valueArr = QueryData.value
      
      if (QueryArr.length == undefined || QueryArr.length == null || QueryArr.length <= 0) {
        let sql = `SELECT * FROM ${QTable}`
          con.query(sql, (err, result) => {
            data.push(result)
          })
      } else {
        let string = `SELECT * FROM ${QTable} WHERE `
        let sqlArr = []
        for (let j = 0; j < QueryArr.length; j++) {
          const Query = QueryArr[j];
          const value = valueArr[j]
          sqlArr.push(`${Query} = "${value}"`)

          if (j !== (QueryArr.length - 1)) {
            sqlArr.push(" AND ")
          }
        }
        setTimeout(() => {
          let strSqlArr = sqlArr.toString()
          let replacedString = strSqlArr.replaceAll(",", "")
          let sql = string.concat(replacedString)
          con.query(sql, (err, result) => {
            if (result.length > 0) {
              data.push(result)
            } else {
              data.push("empty")
            }
          })
        }, 1000);
      }
      
    }
  })
  return data
}

module.exports = { connectToDatabase, getDataFrom, getDataFromDB, con};



// con.connect(function(err) {
//     if (err) throw err;
//     console.log('Connected to your database.')
//   });

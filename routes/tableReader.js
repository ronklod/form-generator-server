var express = require('express');
var physical = require('../dbSchema/physical');
var envelope =  require('../dbSchema/envelope');
var student =  require('../dbSchema/student');
var classes =  require('../dbSchema/classes');
var student_classes =  require('../dbSchema/student_classes');
var router = express.Router();
const sql = require('mssql');


const sqlConfig = {
    // user: 'adx_read_only_user',
    // password: 'PD49%eA6zjSd',
    // database: 'Barilla_raw_copy',
    // server: 'stg-rnd-sql-server.database.windows.net',
    user: 'sa',
    password: 'Seebo19!!',
    database: 'test_db',
    server: 'localhost',
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true, // for azure
        trustServerCertificate: true // change to true for local dev / self-signed certs
    }
}

/* get table data. */
router.get('/:table', async function(req, res, next) {

    let table = req.params['table'];
    let resultObj = {
        columns: eval(table + '.columns'), //to fix
        data: null
    }

  try {
        let result = null;
        // make sure that any items are correctly URL encoded in the connection string
        await sql.connect(sqlConfig);
        result = await sql.query(eval(table+'.queries.main'));
        console.dir(result)
        resultObj.data = result;
        res.send(JSON.stringify(resultObj));

    } catch (err) {
      console.log(err)
    }

});

router.get('/physicalSchema', async function(req, res, next) {
   res.send(physical.columns);
});


/* save a new item in the DB. */
router.post('/:table', async function(req, res, next) {

    let table = req.params['table'];
    const formData = JSON.parse(req.body.tableData);

    try {
        let result = null;
        // make sure that any items are correctly URL encoded in the connection string
        await sql.connect(sqlConfig);
        let columns = "";
        let values = "";
        for(let k in formData){
            //building the columns & values for th einsert statement
            let columnDefinition = JSON.parse(formData[k].columnDefinition);
            columns += formData[k].name + ","
            if(columnDefinition.type.indexOf("varchar") >=0) {
                values += "'" + formData[k].value + "',";
            }
            else{
                values += formData[k].value + ",";
            }
        }

        columns = columns.substr(0, columns.length-1);
        values =  values.substr(0, values.length-1);

        let insert_statement = "insert into " + table + "("  + columns + ") values (" +values + ")";

        result = await  sql.query(insert_statement);
       //result = await  sql.query(eval(table+'.queries.insert'));

        console.dir(result)
        res.send(JSON.stringify(result));

        // If the execution reaches this line, the transaction has been committed successfully
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message);
        // If the execution reaches this line, an error occurred.
        // The transaction has already been rolled back automatically by Sequelize!
    }
});



/* save a new item in the DB. */
router.put('/:table', async function(req, res, next) {

    let table = req.params['table'];
    const formData = JSON.parse(req.body.tableData);
    const key = req.body.key;

    try {
        let result = null;
        // make sure that any items are correctly URL encoded in the connection string
        await sql.connect(sqlConfig);
        let columns = "";
        let value = "";
        let where = "";
        for(let i=0; i<formData.length;i++){
            //building the columns & values for th einsert statement
            let columnDefinition = formData[i].columnDefinition;
            if(columnDefinition == null)
                continue;

            if(columnDefinition.pk) {
                let and = " and ";
                if(where == "")
                    where = formData[i].name + "=" +formData[i].value;
                else
                    where += and +  formData[i].name + "=" +formData[i].value;
                continue;
            }

            if(columnDefinition.type.indexOf("varchar") >=0) {
                value = "'" + formData[i].value + "'";
            }
            else{
                value = formData[i].value ;
            }

            columns += formData[i].name + "=" +  value + ",";
        }

        columns = columns.substr(0, columns.length-1);
        let update_statement = "update " + table + " set " + columns + " where " +where;

        result = await  sql.query(update_statement);

        console.dir(result)
        res.send(JSON.stringify(result));

        // If the execution reaches this line, the transaction has been committed successfully
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message);
        // If the execution reaches this line, an error occurred.
        // The transaction has already been rolled back automatically by Sequelize!
    }
});

module.exports = router;
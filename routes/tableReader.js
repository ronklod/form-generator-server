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
  try {
      let table = req.params['table'];
      let resultObj = {
          columns: eval(table + '.columns'), //to fix
          data: null,
          f_keys: {definition: eval(table + '.f_keys'), data:[]}
      }

      let result = null;
        // make sure that any items are correctly URL encoded in the connection string
        await sql.connect(sqlConfig);
        result = await sql.query(eval(table+'.queries.main'));
        resultObj.data = result;
        if(resultObj.f_keys && resultObj.f_keys.definition&&  resultObj.f_keys.definition.length > 0){
            for(let i=0; i< resultObj.f_keys.definition.length;i++){
                result = await sql.query(eval(table+'.f_keys['+ i +'].query'));
                resultObj.f_keys.data.push({name: eval(table+'.f_keys['+ i +'].name'), value: result});
            }
        }
        //console.dir(result)
        res.send(JSON.stringify(resultObj));
    } catch (err) {
      console.log(err)
    }

});

router.get('/physicalSchema', async function(req, res, next) {
   res.send(physical.columns);
});

router.get('/physicalSchema', async function(req, res, next) {
    res.send(physical.columns);
});

/* save a new item in the DB. */
router.post('/:table', async function(req, res, next) {
    try {
        let table = req.params['table'];
        const formData = JSON.parse(req.body.tableData);
        let result = null;
        let columns = "";
        let values = "";

        for(let k in formData){
            //building the columns & values for th einsert statement
            let columnDefinition = formData[k].columnDefinition;
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

        // make sure that any items are correctly URL encoded in the connection string
        await sql.connect(sqlConfig);
        let insert_statement = "insert into " + table + "("  + columns + ") values (" +values + ")";
        result = await  sql.query(insert_statement);

        console.dir(result)
        res.status(200).send(JSON.stringify(result));

    } catch (error) {
        console.log(error)
        res.status(500).send(error.message);
    }
});

/* save a new item in the DB. */
router.put('/:table', async function(req, res, next) {
    try {
        let table = req.params['table'];
        const formData = JSON.parse(req.body.tableData);
        const originalValues = JSON.parse(req.body.originalValues);
        const key = req.body.key;
        let result = null;
        let columns = "";
        let value = "";

        for(let i=0; i<formData.length;i++){
            //building the columns & values for th einsert statement
            let columnDefinition = formData[i].columnDefinition;
            if(columnDefinition == null || columnDefinition.auto_generated)
                continue;

            if(columnDefinition.type.indexOf("varchar") >=0) {
                value = "'" + formData[i].value + "'";
            }
            else{
                value = formData[i].value;
            }

            columns += formData[i].name + "=" +  value + ",";
        }

        columns = columns.substr(0, columns.length-1);

        // make sure that any items are correctly URL encoded in the connection string
        await sql.connect(sqlConfig);
        let update_statement = "update " + table + " set " + columns + " where " + getUpdateWhereClause(originalValues,formData);
        result = await  sql.query(update_statement);

        //console.dir(result)
        res.status(200).send(JSON.stringify(result));

    } catch (error) {
        console.log(error)
        res.status(500).send(error.message);
    }
});

/* save a new item in the DB. */
router.delete('/:table', async function(req, res, next) {
    try {
        let table = req.params['table'];
        const rawData = JSON.parse(req.body.rawData);
        const colDef = JSON.parse(req.body.colDef);
        let result = null;
        let whereClause = ""
        let and = " and ";

        for(let k in colDef){
            let value = "";

            if(colDef[k].pk){
                if(colDef[k].type.indexOf("varchar") >= 0){
                     value = "'" + rawData[colDef[k].name] + "'" ;
                }else{
                    value +=  rawData[colDef[k].name];
                }

                if(whereClause == ""){
                    whereClause = " " + colDef[k].name + "=" + value;
                }
                else{
                    whereClause += and + colDef[k].name + "=" + value;
                }
            }
        }

        await sql.connect(sqlConfig);
        let delete_statement = "delete from " + table + " where " + whereClause;
        result = await  sql.query(delete_statement);
        res.status(200).send(JSON.stringify(result));
    } catch (error) {
        console.log(error)
        if(error.message.toLowerCase().indexOf("reference")>=0){
            res.status(500).send(error.message);
        }
        else {
            res.status(500).send(error.message);
        }
    }
});

const getUpdateWhereClause = (originalValues, currentValues) =>{
    let whereCluase = "";
    let value = "";
    let and = " and ";
    for (let i=0; i<currentValues.length;i++){
        if(currentValues[i].columnDefinition && currentValues[i].columnDefinition.pk == true){
            if(currentValues[i].columnDefinition.type.indexOf("varchar") >=0) {
                value = "'" + originalValues[currentValues[i].name] + "'";
            }
            else{
                value = originalValues[currentValues[i].name];
            }

            if(whereCluase == "") {
                whereCluase = currentValues[i].name + "=" + value;
            }
            else{
                whereCluase += and + currentValues[i].name + "=" + value;
            }
        }
    }
    return whereCluase;
}

module.exports = router;
